"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Gamepad2,
  RadioTower,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { LogoMark } from "@/components/ui/Logo";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { LAST_ONLINE_ROUTE_KEY } from "@/lib/network/offline-storage";
import { cn } from "@/lib/utils/cn";
import { normalizePathname, routes } from "@/lib/utils/routes";

type Choice = "rock" | "paper" | "scissors";
type RoundResult = "win" | "loss" | "draw";

interface Round {
  player: Choice;
  computer: Choice;
  result: RoundResult;
  sequence: number;
}

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  history: Round[];
}

const GAME_STORAGE_KEY = "dineboard.offline-rps.v1";
const GAME_CHANGE_EVENT = "dineboard-offline-rps-change";
const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  history: [],
};
const DEFAULT_SNAPSHOT = JSON.stringify(DEFAULT_STATS);
let volatileSnapshot = DEFAULT_SNAPSHOT;

const choices: { id: Choice; label: string; emoji: string; beats: string }[] = [
  { id: "rock", label: "Rock", emoji: "🪨", beats: "crushes scissors" },
  { id: "paper", label: "Paper", emoji: "📄", beats: "covers rock" },
  { id: "scissors", label: "Scissors", emoji: "✂️", beats: "cuts paper" },
];

const resultCopy: Record<RoundResult, { eyebrow: string; title: string; tone: string }> = {
  win: { eyebrow: "Round secured", title: "You win", tone: "text-success-soft" },
  loss: { eyebrow: "CPU takes it", title: "Computer wins", tone: "text-danger-soft" },
  draw: { eyebrow: "Perfect mirror", title: "It’s a draw", tone: "text-ink-foreground" },
};

function subscribeGame(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(GAME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(GAME_CHANGE_EVENT, callback);
  };
}

function getGameSnapshot(): string {
  try {
    return window.localStorage.getItem(GAME_STORAGE_KEY) ?? volatileSnapshot;
  } catch {
    return volatileSnapshot;
  }
}

function getServerGameSnapshot(): string {
  return DEFAULT_SNAPSHOT;
}

function isChoice(value: unknown): value is Choice {
  return value === "rock" || value === "paper" || value === "scissors";
}

function isResult(value: unknown): value is RoundResult {
  return value === "win" || value === "loss" || value === "draw";
}

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function parseStats(snapshot: string): GameStats {
  try {
    const value = JSON.parse(snapshot) as Partial<GameStats>;
    const history = Array.isArray(value.history)
      ? value.history
          .filter(
            (round): round is Round =>
              typeof round === "object" &&
              round !== null &&
              isChoice(round.player) &&
              isChoice(round.computer) &&
              isResult(round.result) &&
              typeof round.sequence === "number",
          )
          .slice(0, 5)
      : [];

    return {
      wins: safeCount(value.wins),
      losses: safeCount(value.losses),
      draws: safeCount(value.draws),
      currentStreak: safeCount(value.currentStreak),
      bestStreak: safeCount(value.bestStreak),
      history,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(stats: GameStats): void {
  const snapshot = JSON.stringify(stats);
  volatileSnapshot = snapshot;

  try {
    window.localStorage.setItem(GAME_STORAGE_KEY, snapshot);
  } catch {
    /* Keep the in-memory fallback when persistent storage is unavailable. */
  }

  window.dispatchEvent(new Event(GAME_CHANGE_EVENT));
}

function randomChoice(): Choice {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return choices[values[0] % choices.length].id;
}

function decideRound(player: Choice, computer: Choice): RoundResult {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }
  return "loss";
}

function choiceDetails(choice: Choice | undefined) {
  return choices.find((item) => item.id === choice);
}

function readReturnRoute(): string {
  try {
    const stored = window.sessionStorage.getItem(LAST_ONLINE_ROUTE_KEY);
    const normalizedStored = stored ? normalizePathname(stored) : null;
    if (
      normalizedStored &&
      normalizedStored.startsWith("/") &&
      !normalizedStored.startsWith("//") &&
      normalizedStored !== routes.offline()
    ) {
      return normalizedStored;
    }
  } catch {
    /* Fall through to the safe home route. */
  }
  return routes.home();
}

export function OfflineArcade() {
  const router = useRouter();
  const online = useOnlineStatus();
  const snapshot = useSyncExternalStore(
    subscribeGame,
    getGameSnapshot,
    getServerGameSnapshot,
  );
  const stats = useMemo(() => parseStats(snapshot), [snapshot]);
  const [round, setRound] = useState<Round | null>(null);
  const visibleRound = round ?? stats.history[0] ?? null;
  const playerChoice = choiceDetails(visibleRound?.player);
  const computerChoice = choiceDetails(visibleRound?.computer);
  const totalRounds = stats.wins + stats.losses + stats.draws;
  const winRate = totalRounds ? Math.round((stats.wins / totalRounds) * 100) : 0;

  function play(player: Choice) {
    const computer = randomChoice();
    const result = decideRound(player, computer);
    const currentStreak = result === "win" ? stats.currentStreak + 1 : 0;
    const nextRound: Round = { player, computer, result, sequence: totalRounds + 1 };

    saveStats({
      wins: stats.wins + (result === "win" ? 1 : 0),
      losses: stats.losses + (result === "loss" ? 1 : 0),
      draws: stats.draws + (result === "draw" ? 1 : 0),
      currentStreak,
      bestStreak: Math.max(stats.bestStreak, currentStreak),
      history: [nextRound, ...stats.history].slice(0, 5),
    });
    setRound(nextRound);
  }

  function resetGame() {
    saveStats(DEFAULT_STATS);
    setRound(null);
  }

  function returnToApp() {
    if (!online) return;
    const returnRoute = readReturnRoute();
    try {
      window.sessionStorage.removeItem(LAST_ONLINE_ROUTE_KEY);
    } catch {
      /* A stale return route is harmless if session storage is unavailable. */
    }
    router.replace(returnRoute);
  }

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_65%_at_50%_-10%,rgb(var(--primary-rgb)/0.48),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-36 -z-10 size-[32rem] rounded-full border border-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 -z-10 size-[24rem] rounded-full border border-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-9rem] bottom-[-12rem] -z-10 size-[34rem] rounded-full bg-primary/10 blur-3xl" />

      <header className="mx-auto flex w-full max-w-[90rem] items-center gap-3 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-9" />
          <span className="text-lg font-extrabold tracking-[-0.035em]">Dine<span className="font-semibold text-[var(--accent)]">Board</span></span>
        </div>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-bold",
            online
              ? "border-success/30 bg-success/15 text-success-soft"
              : "border-danger/30 bg-danger/15 text-danger-soft",
          )}
          role="status"
        >
          {online ? <Wifi className="size-3.5" aria-hidden="true" /> : <WifiOff className="size-3.5" aria-hidden="true" />}
          {online ? "Signal restored" : "You’re offline"}
        </span>
      </header>

      <main className="mx-auto w-full max-w-[90rem] px-5 pt-5 pb-10 sm:px-8 lg:px-10 lg:pt-8 lg:pb-14">
        <section className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.55fr)]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--accent)] uppercase">
              <Gamepad2 className="size-3.5" aria-hidden="true" /> Offline arcade
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.02] font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              No signal. <span className="font-display font-normal text-[var(--accent)] italic">Still game.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
              The network stepped out, so the computer stepped up. Pick your move—your score and streak stay saved on this device.
            </p>
          </div>

          <div className="rounded-card border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm sm:p-5">
            <div className="flex items-center gap-3">
              <span className={cn("grid size-10 place-items-center rounded-control", online ? "bg-success/15 text-success-soft" : "bg-danger/15 text-danger-soft")}>
                {online ? <ShieldCheck className="size-5" aria-hidden="true" /> : <RadioTower className="size-5" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-sm font-bold">{online ? "Connection is back" : "Connection interrupted"}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{online ? "Finish the round or return when ready." : "We’ll keep checking in the background."}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={returnToApp}
              disabled={!online}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-pill bg-white px-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-ink-muted disabled:hover:translate-y-0"
            >
              {online ? "Return to DineBoard" : "Waiting for network"}
              {online ? <ArrowRight className="size-4" aria-hidden="true" /> : <WifiOff className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </section>

        <section aria-label="Game score" className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { label: "Wins", value: stats.wins, icon: Trophy, tone: "text-success-soft" },
            { label: "Draws", value: stats.draws, icon: Zap, tone: "text-[var(--accent)]" },
            { label: "Losses", value: stats.losses, icon: RadioTower, tone: "text-danger-soft" },
            { label: "Best streak", value: stats.bestStreak, icon: ShieldCheck, tone: "text-warning-soft" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.dl
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-card border border-white/10 bg-white/[0.045] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[0.625rem] font-bold tracking-[0.12em] text-ink-muted uppercase">{item.label}</dt>
                  <Icon className={cn("size-4", item.tone)} aria-hidden="true" />
                </div>
                <dd className="mt-2 text-2xl font-extrabold tracking-[-0.04em] tabular-nums">{item.value}</dd>
              </motion.dl>
            );
          })}
        </section>

        <section aria-labelledby="arena-title" className="mt-4 overflow-hidden rounded-panel border border-white/10 bg-white/[0.045] shadow-lift backdrop-blur-sm">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">Best of endless</p>
              <h2 id="arena-title" className="mt-1 text-xl font-extrabold">Rock, paper, scissors</h2>
            </div>
            <p className="text-xs font-semibold text-ink-muted tabular-nums">{totalRounds} rounds · {winRate}% win rate</p>
          </div>

          <div className="grid items-stretch lg:grid-cols-[1fr_minmax(12rem,0.48fr)_1fr]">
            <div className="grid min-h-56 place-items-center px-5 py-7 text-center sm:min-h-64">
              <div>
                <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink-muted uppercase">Your move</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`player-${visibleRound?.sequence ?? "empty"}`}
                    initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-4 text-7xl sm:text-8xl"
                    aria-hidden="true"
                  >
                    {playerChoice?.emoji ?? "❔"}
                  </motion.div>
                </AnimatePresence>
                <p className="mt-4 text-lg font-extrabold">{playerChoice?.label ?? "Choose below"}</p>
              </div>
            </div>

            <div className="relative grid min-h-40 place-items-center border-y border-white/10 bg-ink/35 px-5 py-7 text-center lg:min-h-64 lg:border-x lg:border-y-0">
              <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
              <div className="relative" aria-live="polite" aria-atomic="true">
                {visibleRound ? (
                  <motion.div key={visibleRound.sequence} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink-muted uppercase">{resultCopy[visibleRound.result].eyebrow}</p>
                    <p className={cn("mt-2 text-2xl font-extrabold tracking-[-0.04em]", resultCopy[visibleRound.result].tone)}>{resultCopy[visibleRound.result].title}</p>
                    <p className="mt-2 text-xs text-ink-muted">{playerChoice?.label} vs {computerChoice?.label}</p>
                  </motion.div>
                ) : (
                  <div>
                    <p className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--accent)]">VS</p>
                    <p className="mt-2 text-xs text-ink-muted">First move is yours</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid min-h-56 place-items-center px-5 py-7 text-center sm:min-h-64">
              <div>
                <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink-muted uppercase">Computer</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`computer-${visibleRound?.sequence ?? "empty"}`}
                    initial={{ opacity: 0, scale: 0.72, rotate: 8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.08 }}
                    className="mt-4 text-7xl sm:text-8xl"
                    aria-hidden="true"
                  >
                    {computerChoice?.emoji ?? "🤖"}
                  </motion.div>
                </AnimatePresence>
                <p className="mt-4 text-lg font-extrabold">{computerChoice?.label ?? "CPU ready"}</p>
              </div>
            </div>
          </div>

          <fieldset className="border-t border-white/10 bg-ink/25 px-5 py-5 sm:px-7 sm:py-6">
            <legend className="sr-only">Choose rock, paper or scissors</legend>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => play(choice.id)}
                  className="group flex min-h-20 items-center gap-4 rounded-card border border-white/10 bg-white/[0.055] px-4 py-3 text-left transition-[transform,border-color,background-color] hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/15 sm:justify-center sm:text-center"
                >
                  <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden="true">{choice.emoji}</span>
                  <span>
                    <span className="block text-sm font-extrabold">{choice.label}</span>
                    <span className="mt-0.5 block text-[0.625rem] text-ink-muted">{choice.beats}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-card border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-[var(--accent)] uppercase">Saved locally</p>
                <h2 className="mt-1 text-lg font-extrabold">Recent rounds</h2>
              </div>
              <span className="text-xs font-semibold text-ink-muted">Last 5</span>
            </div>

            {stats.history.length ? (
              <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                {stats.history.map((item, index) => (
                  <li key={`${item.sequence}-${index}`} className="flex items-center gap-3 rounded-control border border-white/8 bg-white/[0.035] px-3 py-3">
                    <span className="text-xl" aria-hidden="true">{choiceDetails(item.player)?.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-xs font-bold", resultCopy[item.result].tone)}>{resultCopy[item.result].title}</span>
                      <span className="block truncate text-[0.625rem] text-ink-muted">vs {choiceDetails(item.computer)?.label}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 rounded-control border border-dashed border-white/10 px-4 py-5 text-sm text-ink-muted">Your first round will appear here and survive refreshes.</p>
            )}
          </div>

          <button
            type="button"
            onClick={resetGame}
            disabled={!totalRounds}
            className="inline-flex min-h-14 items-center justify-center gap-2 self-stretch rounded-card border border-white/10 bg-white/[0.04] px-6 text-sm font-bold text-ink-muted transition-colors hover:border-danger/35 hover:bg-danger/10 hover:text-danger-soft disabled:cursor-not-allowed disabled:opacity-40 lg:min-w-44"
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reset score
          </button>
        </section>
      </main>
    </div>
  );
}
