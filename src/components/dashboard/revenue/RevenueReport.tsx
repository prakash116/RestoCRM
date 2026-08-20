"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Building2,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Landmark,
  ReceiptIndianRupee,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TimerReset,
  WalletCards,
} from "lucide-react";
import { motion } from "motion/react";

import { RevenueChart } from "@/components/dashboard/revenue/RevenueChart";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  gatewayAdoption,
  paymentMethodMix,
  restaurantRevenue,
  revenuePeriods,
  revenueScopeFactors,
  revenueSeries,
  type RevenueMetric,
  type RevenuePeriod,
  type RevenuePoint,
  type SettlementStatus,
} from "@/data/revenue";
import { cn } from "@/lib/utils/cn";

type CityFilter = keyof typeof revenueScopeFactors.city;
type ProviderFilter = keyof typeof revenueScopeFactors.provider;
type StatusFilter = "All" | SettlementStatus;

interface PrimaryMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: LucideIcon;
  tone: "brand" | "success" | "warning" | "neutral";
  direction: "up" | "down";
  favourable: boolean;
  sparkline: number[];
}

const cityOptions: CityFilter[] = ["All", "Delhi", "Gurugram", "Noida", "Faridabad"];
const providerOptions: ProviderFilter[] = ["All", "Razorpay", "DineBoard Pay"];
const statusOptions: StatusFilter[] = ["All", "Settled", "Pending", "On hold"];
const heroBars = [31, 43, 38, 58, 49, 70, 62, 84, 76, 96, 88, 112];

function formatMoney(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `₹${Math.round(value / 1_000)}K`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatFullMoney(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function scaleSeries(data: RevenuePoint[], factor: number): RevenuePoint[] {
  return data.map((point) => {
    const grossRevenue = Math.round(point.grossRevenue * factor);
    const pendingAmount = Math.round(point.pendingAmount * factor);
    const refunds = Math.round(grossRevenue * 0.0152);
    const fees = Math.round(grossRevenue * 0.0337);

    return {
      ...point,
      grossRevenue,
      previousGross: Math.round(point.previousGross * factor),
      netPayout: grossRevenue - refunds - fees - pendingAmount,
      pendingAmount,
      orders: Math.max(1, Math.round(point.orders * factor)),
    };
  });
}

function sparkPath(values: number[], width = 88, height = 30): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function Sparkline({ values, negative = false }: { values: number[]; negative?: boolean }) {
  return (
    <svg viewBox="0 0 88 30" aria-hidden="true" className="h-[1.875rem] w-[5.5rem] overflow-visible">
      <motion.path
        d={sparkPath(values)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className={negative ? "text-danger" : "text-primary"}
      />
    </svg>
  );
}

function PrimaryMetricCard({ metric, scopeKey }: { metric: PrimaryMetric; scopeKey: string }) {
  const Icon = metric.icon;
  const DirectionIcon = metric.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const tones = {
    brand: "bg-primary-soft text-primary-strong",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    neutral: "bg-secondary text-secondary-foreground",
  } as const;

  return (
    <SpotlightCard className="h-full p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-control", tones[metric.tone])}>
          <Icon className="size-[1.125rem]" aria-hidden="true" />
        </span>
        <Sparkline values={metric.sparkline} negative={!metric.favourable} />
      </div>
      <dl className="mt-5">
        <dt className="text-[0.6875rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
          {metric.label}
        </dt>
        <motion.dd
          key={`${metric.id}-${scopeKey}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-2xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums"
        >
          {metric.value}
        </motion.dd>
      </dl>
      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.6875rem] text-muted-foreground">
        <span className={cn("inline-flex items-center gap-0.5 font-bold tabular-nums", metric.favourable ? "text-success" : "text-danger")}>
          <DirectionIcon className="size-3.5" aria-hidden="true" />
          {metric.change}
        </span>
        <span>{metric.comparison}</span>
      </p>
    </SpotlightCard>
  );
}

function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block min-w-[9.5rem] flex-1 sm:flex-none">
      <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-control border border-input bg-card px-3 text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary/40 focus:border-primary focus:outline-none sm:w-44"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? `All ${label.toLowerCase()}` : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function GatewayRing({ razorpayShare, connected }: { razorpayShare: number; connected: number }) {
  const dineBoardShare = 100 - razorpayShare;

  return (
    <div
      role="img"
      aria-label={`${razorpayShare.toFixed(1)} percent Razorpay and ${dineBoardShare.toFixed(1)} percent DineBoard Pay`}
      className="relative grid size-44 place-items-center"
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" className="absolute inset-0 size-full -rotate-90 overflow-visible">
        <circle cx="60" cy="60" r="47" fill="none" stroke="var(--muted)" strokeWidth="12" />
        <motion.circle
          cx="60"
          cy="60"
          r="47"
          pathLength="100"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 100" }}
          whileInView={{ strokeDasharray: `${razorpayShare} ${100 - razorpayShare}` }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r="47"
          pathLength="100"
          fill="none"
          stroke="var(--success)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDashoffset={-razorpayShare - 1.5}
          initial={{ strokeDasharray: "0 100" }}
          whileInView={{ strokeDasharray: `${Math.max(0, dineBoardShare - 3)} ${100 - Math.max(0, dineBoardShare - 3)}` }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.34 }}
        />
      </svg>
      <span className="relative text-center">
        <strong className="block text-3xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">{connected}</strong>
        <span className="mt-0.5 block text-[0.625rem] font-bold tracking-wider text-muted-foreground uppercase">Connected</span>
      </span>
    </div>
  );
}

function accountPending(status: SettlementStatus, grossRevenue: number): number {
  if (status === "Settled") return 0;
  return Math.round(grossRevenue * (status === "On hold" ? 0.061 : 0.034));
}

export function RevenueReport() {
  const [period, setPeriod] = useState<RevenuePeriod>("30d");
  const [city, setCity] = useState<CityFilter>("All");
  const [provider, setProvider] = useState<ProviderFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [metric, setMetric] = useState<RevenueMetric>("grossRevenue");

  const cityFactor = revenueScopeFactors.city[city];
  const providerFactor = revenueScopeFactors.provider[provider];
  const financialScopeFactor = cityFactor * providerFactor;
  const scopeKey = `${period}-${city}-${provider}`;
  const periodLabel = revenuePeriods.find((item) => item.id === period)?.fullLabel ?? "Selected period";
  const chartData = useMemo(
    () => scaleSeries(revenueSeries[period], financialScopeFactor),
    [financialScopeFactor, period],
  );
  const latestPoint = chartData.at(-1)!;
  const networkLatest = revenueSeries[period].at(-1)!;
  const ledgerPeriodFactor =
    networkLatest.grossRevenue / revenueSeries["30d"].at(-1)!.grossRevenue;

  const refunds = Math.round(latestPoint.grossRevenue * 0.0152);
  const fees = Math.round(latestPoint.grossRevenue * 0.0337);
  const netSettled = latestPoint.grossRevenue - refunds - fees - latestPoint.pendingAmount;
  const razorpayRestaurants = Math.round(gatewayAdoption[0].restaurants * cityFactor);
  const dineBoardRestaurants = Math.round(gatewayAdoption[1].restaurants * cityFactor);

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return restaurantRevenue.filter(
      (account) =>
        (city === "All" || account.city === city) &&
        (provider === "All" || account.provider === provider) &&
        (status === "All" || account.status === status) &&
        (!normalizedQuery ||
          account.name.toLocaleLowerCase().includes(normalizedQuery) ||
          account.locality.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [city, provider, query, status]);

  const primaryMetrics: PrimaryMetric[] = [
    {
      id: "processed",
      label: "Total processed",
      value: formatMoney(latestPoint.grossRevenue),
      change: "+14.3%",
      comparison: "gross payment volume",
      icon: BadgeIndianRupee,
      tone: "brand",
      direction: "up",
      favourable: true,
      sparkline: chartData.slice(-7).map((point) => point.grossRevenue),
    },
    {
      id: "razorpay",
      label: "Razorpay connected",
      value: razorpayRestaurants.toLocaleString("en-IN"),
      change: "69.6%",
      comparison: "of payment-ready restaurants",
      icon: Landmark,
      tone: "neutral",
      direction: "up",
      favourable: true,
      sparkline: [91, 96, 101, 108, 115, 121, 128].map((value) => value * cityFactor),
    },
    {
      id: "dineboard",
      label: "DineBoard gateway",
      value: dineBoardRestaurants.toLocaleString("en-IN"),
      change: "+8",
      comparison: "connected this period",
      icon: WalletCards,
      tone: "success",
      direction: "up",
      favourable: true,
      sparkline: [29, 34, 38, 41, 47, 51, 56].map((value) => value * cityFactor),
    },
    {
      id: "pending",
      label: "Pending settlement",
      value: formatMoney(latestPoint.pendingAmount),
      change: "−8.6%",
      comparison: "vs previous cycle",
      icon: TimerReset,
      tone: "warning",
      direction: "down",
      favourable: true,
      sparkline: chartData.slice(-7).map((point) => point.pendingAmount),
    },
  ];

  const filtersActive = city !== "All" || provider !== "All" || status !== "All" || query.length > 0;

  function resetFilters() {
    setCity("All");
    setProvider("All");
    setStatus("All");
    setQuery("");
  }

  const pendingBuckets = [
    { label: "Under 24 hours", share: 53, payouts: 6, tone: "bg-primary" },
    { label: "1–2 days", share: 26, payouts: 4, tone: "bg-primary/70" },
    { label: "3–7 days", share: 15, payouts: 3, tone: "bg-warning" },
    { label: "Over 7 days", share: 6, payouts: 1, tone: "bg-danger" },
  ];

  const moneyFlow = [
    { label: "Gross volume", value: latestPoint.grossRevenue, note: "customer payments", tone: "text-primary-strong" },
    { label: "Refunds", value: refunds, note: "1.52% reversed", tone: "text-danger", subtract: true },
    { label: "Platform fees", value: fees, note: "gateway + platform", tone: "text-warning", subtract: true },
    { label: "Pending", value: latestPoint.pendingAmount, note: "awaiting settlement", tone: "text-warning", subtract: true },
    { label: "Net settled", value: netSettled, note: "paid to restaurants", tone: "text-success" },
  ];

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <Reveal as="header" className="relative isolate overflow-hidden rounded-panel border border-primary/15 bg-card px-5 py-7 shadow-card sm:px-7 sm:py-9 lg:px-9 lg:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_130%_at_100%_0%,rgb(var(--primary-rgb)/0.22),transparent_65%)]" />
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(19rem,0.68fr)]">
          <div>
            <AnimatedBadge tone="brand" pulse>Payment operations</AnimatedBadge>
            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              Revenue, right down to the payout.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Follow every customer payment from gross collection to restaurant settlement. Total processed is payment volume, not DineBoard earnings.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Clock3 className="size-3.5" aria-hidden="true" />Updated 2 minutes ago</span>
              <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" aria-hidden="true" />Payment rails healthy</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-card bg-ink p-5 text-ink-foreground shadow-lift">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_100%_at_100%_0%,rgb(var(--primary-rgb)/0.42),transparent_72%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.625rem] font-bold tracking-[0.13em] text-ink-muted uppercase">Next settlement run</p>
                <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] tabular-nums">Tomorrow · 11:00</p>
                <p className="mt-1 text-xs text-ink-muted">14 payouts queued · 3 need review</p>
              </div>
              <span className="grid size-10 place-items-center rounded-control bg-white/10 text-[var(--accent)]"><ShieldCheck className="size-5" aria-hidden="true" /></span>
            </div>
            <div aria-hidden="true" className="relative mt-6 flex h-16 items-end gap-1.5">
              {heroBars.map((height, index) => (
                <motion.span
                  key={index}
                  className="min-w-0 flex-1 rounded-t-sm bg-[var(--accent)]/70"
                  initial={{ height: 0, opacity: 0.25 }}
                  animate={{ height: `${Math.min(height / 1.25, 100)}%`, opacity: index > 8 ? 0.95 : 0.48 }}
                  transition={{ duration: 0.45, delay: index * 0.035 }}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="mt-5 rounded-card border border-border bg-card p-4 shadow-card sm:p-5">
        <h2 className="sr-only">Revenue filters</h2>
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-end">
          <fieldset>
            <legend className="mb-1.5 flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              <CalendarRange className="size-3.5" aria-hidden="true" />Report period
            </legend>
            <div className="flex w-fit rounded-control bg-muted p-1">
              {revenuePeriods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPeriod(item.id)}
                  aria-pressed={period === item.id}
                  className={cn(
                    "h-9 rounded-[0.55rem] px-3.5 text-xs font-bold transition-[background-color,color,box-shadow] sm:px-4",
                    period === item.id ? "bg-card text-primary-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-1 flex-wrap gap-3">
            <SelectFilter id="revenue-city" label="Cities" value={city} options={cityOptions} onChange={(value) => setCity(value as CityFilter)} />
            <SelectFilter id="revenue-provider" label="Providers" value={provider} options={providerOptions} onChange={(value) => setProvider(value as ProviderFilter)} />
            <SelectFilter id="revenue-status" label="Ledger status" value={status} options={statusOptions} onChange={(value) => setStatus(value as StatusFilter)} />
            <label htmlFor="revenue-search" className="block min-w-[13rem] flex-[1.3]">
              <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">Find account</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="revenue-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Restaurant or locality"
                  className="h-11 w-full rounded-control border border-input bg-card pr-3 pl-9 text-sm font-semibold text-foreground shadow-soft transition-colors placeholder:font-normal placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:outline-none"
                />
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!filtersActive}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="size-4" aria-hidden="true" />Reset
          </button>
        </div>
        <p aria-live="polite" className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3.5 shrink-0" aria-hidden="true" />
          Amounts use {periodLabel.toLowerCase()}, {city === "All" ? "all cities" : city} and {provider === "All" ? "all providers" : provider}; the ledger also uses {status === "All" ? "all settlement states" : status.toLowerCase()} and search · {filteredAccounts.length} sample accounts
        </p>
      </Reveal>

      <RevealGroup className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4" stagger={0.055}>
        {primaryMetrics.map((item) => (
          <RevealItem key={item.id}><PrimaryMetricCard metric={item} scopeKey={scopeKey} /></RevealItem>
        ))}
      </RevealGroup>

      <Reveal as="section" className="mt-3 grid overflow-hidden rounded-card border border-border bg-card shadow-card sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Net settled", value: formatMoney(netSettled), note: "after all deductions", icon: CheckCircle2, tone: "text-success" },
          { label: "Platform + gateway fees", value: formatMoney(fees), note: "3.37% of volume", icon: ReceiptIndianRupee, tone: "text-warning" },
          { label: "Refunded", value: formatMoney(refunds), note: "1.52% refund rate", icon: CircleDollarSign, tone: "text-danger" },
          { label: "Payment success", value: `${latestPoint.successRate.toFixed(1)}%`, note: `${latestPoint.orders.toLocaleString("en-IN")} payment attempts`, icon: ShieldCheck, tone: "text-primary-strong" },
        ].map((item, index) => {
          const Icon = item.icon;
          const dividerClass = [
            "",
            "border-t border-border sm:border-t-0 sm:border-l",
            "border-t border-border xl:border-t-0 xl:border-l",
            "border-t border-border sm:border-l xl:border-t-0",
          ][index];
          return (
            <div key={item.label} className={cn("flex items-center gap-3 px-5 py-4", dividerClass)}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-control bg-muted", item.tone)} aria-hidden="true"><Icon className="size-4" /></span>
              <dl className="min-w-0">
                <dt className="truncate text-[0.625rem] font-bold tracking-wider text-muted-foreground uppercase">{item.label}</dt>
                <dd className="mt-0.5 text-base font-extrabold text-foreground tabular-nums">{item.value}</dd>
                <dd className="truncate text-[0.625rem] text-muted-foreground">{item.note}</dd>
              </dl>
            </div>
          );
        })}
      </Reveal>

      <Reveal as="section" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.72fr)_minmax(19rem,0.62fr)]">
        <RevenueChart data={chartData} metric={metric} onMetricChange={setMetric} periodLabel={periodLabel} />

        <section aria-labelledby="gateway-mix-title" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Network coverage</p>
              <h2 id="gateway-mix-title" className="mt-1.5 text-lg font-extrabold text-foreground">Gateway mix</h2>
            </div>
            <AnimatedBadge tone="success" pulse>Live</AnimatedBadge>
          </div>

          <div className="mt-5 grid place-items-center">
            <GatewayRing
              razorpayShare={gatewayAdoption[0].share}
              connected={razorpayRestaurants + dineBoardRestaurants}
            />
          </div>

          <ul className="mt-5 space-y-3">
            {gatewayAdoption.map((gateway, index) => {
              const volume = networkLatest.grossRevenue * cityFactor * (gateway.share / 100);
              const accounts = Math.round(gateway.restaurants * cityFactor);
              return (
                <li key={gateway.provider} className="rounded-control bg-muted/70 px-3.5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("size-2 rounded-full", index === 0 ? "bg-primary" : "bg-success")} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-foreground">{gateway.provider}</span>
                      <span className="mt-0.5 block text-[0.625rem] text-muted-foreground">{accounts} restaurants · {gateway.share}% share</span>
                    </span>
                    <strong className="text-sm font-extrabold text-foreground tabular-nums">{formatMoney(volume)}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-[0.625rem] leading-relaxed text-muted-foreground">Gateway mix stays visible as the network benchmark when one provider is selected.</p>
        </section>
      </Reveal>

      <Reveal as="section" className="mt-5 overflow-hidden rounded-panel border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-5 sm:px-6">
          <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Reconciliation</p>
          <h2 className="mt-1.5 text-lg font-extrabold text-foreground">Where every rupee goes</h2>
          <p className="mt-1 text-xs text-muted-foreground">Gross customer payment volume reconciled into refunds, fees, pending balance and settled value.</p>
        </div>
        <div className="grid lg:grid-cols-5">
          {moneyFlow.map((step, index) => (
            <div key={step.label} className={cn("relative px-5 py-5 sm:px-6", index > 0 && "border-t border-border lg:border-t-0 lg:border-l")}>
              {index > 0 ? <span aria-hidden="true" className="absolute top-1/2 -left-2.5 hidden size-5 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-[0.625rem] font-extrabold text-muted-foreground lg:grid">{step.subtract ? "−" : "="}</span> : null}
              <p className="text-[0.625rem] font-bold tracking-wider text-muted-foreground uppercase">{step.label}</p>
              <motion.p key={`${scopeKey}-${step.label}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-1.5 text-xl font-extrabold tracking-[-0.035em] tabular-nums", step.tone)}>{formatMoney(step.value)}</motion.p>
              <p className="mt-1 text-[0.625rem] text-muted-foreground">{step.note}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.58fr)_minmax(19rem,0.58fr)]">
        <section aria-labelledby="payment-accounts-title" className="min-w-0 overflow-hidden rounded-panel border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Settlement ledger</p>
              <h2 id="payment-accounts-title" className="mt-1.5 text-lg font-extrabold text-foreground">Restaurant payment accounts</h2>
              <p className="mt-1 text-xs text-muted-foreground">Provider, collection and payout health for each connected restaurant.</p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground tabular-nums">{filteredAccounts.length} results</p>
          </div>

          {filteredAccounts.length ? (
            <div role="region" aria-label="Scrollable restaurant payment accounts table" tabIndex={0} className="overflow-x-auto">
              <table className="w-full min-w-[66rem] border-collapse text-left">
                <caption className="sr-only">Restaurant payment accounts with provider, gross volume, fees, net payout, pending amount and settlement status</caption>
                <thead>
                  <tr className="bg-muted/55 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">
                    <th scope="col" className="px-5 py-3.5 sm:pl-6">Restaurant</th>
                    <th scope="col" className="px-3 py-3.5">Provider</th>
                    <th scope="col" className="px-3 py-3.5">Gross processed</th>
                    <th scope="col" className="px-3 py-3.5">Fees</th>
                    <th scope="col" className="px-3 py-3.5">Net payout</th>
                    <th scope="col" className="px-3 py-3.5">Pending</th>
                    <th scope="col" className="px-3 py-3.5 pr-5 sm:pr-6">Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => {
                    const initials = account.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
                    const grossRevenue = Math.round(account.grossRevenue * ledgerPeriodFactor);
                    const gatewayFees = Math.round(account.gatewayFees * ledgerPeriodFactor);
                    const netPayout = Math.round(account.netPayout * ledgerPeriodFactor);
                    const orders = Math.max(1, Math.round(account.orders * ledgerPeriodFactor));
                    const pending = accountPending(account.status, grossRevenue);
                    return (
                      <tr key={account.id} className="group border-t border-border/80 transition-colors hover:bg-primary-soft/40">
                        <th scope="row" className="px-5 py-4 font-normal sm:pl-6">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-control bg-ink text-xs font-extrabold text-ink-foreground">{initials}</span>
                            <span>
                              <span className="block text-sm font-bold text-foreground">{account.name}</span>
                              <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{account.locality}, {account.city}</span>
                            </span>
                          </div>
                        </th>
                        <td className="px-3 py-4"><span className={cn("inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", account.provider === "DineBoard Pay" ? "bg-success-soft text-success" : "bg-primary-soft text-primary-strong")}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{account.provider}</span></td>
                        <td className="px-3 py-4">
                          <span className="block text-sm font-bold text-foreground tabular-nums">{formatMoney(grossRevenue)}</span>
                          <span className="mt-0.5 block text-[0.625rem] text-muted-foreground tabular-nums">{orders.toLocaleString("en-IN")} orders</span>
                        </td>
                        <td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{formatMoney(gatewayFees)}</td>
                        <td className="px-3 py-4 text-sm font-bold text-foreground tabular-nums" title={formatFullMoney(netPayout)}>{formatMoney(netPayout)}</td>
                        <td className="px-3 py-4 text-sm font-bold text-warning tabular-nums">{pending ? formatMoney(pending) : "—"}</td>
                        <td className="px-3 py-4 pr-5 sm:pr-6">
                          <span className={cn("inline-flex rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", account.status === "Settled" ? "bg-success-soft text-success" : account.status === "Pending" ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger")}>{account.status}</span>
                          <span className="mt-1.5 block text-[0.625rem] text-muted-foreground">{account.settlementDate}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center px-6 text-center">
              <div>
                <Building2 className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-foreground">No payment accounts match</p>
                <p className="mt-1 text-xs text-muted-foreground">Change the search or reset filters to restore the ledger.</p>
                <button type="button" onClick={resetFilters} className="mt-4 text-xs font-bold text-primary-strong hover:underline">Reset filters</button>
              </div>
            </div>
          )}
        </section>

        <div className="grid content-start gap-5">
          <section aria-labelledby="settlement-aging-title" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-warning uppercase">Payout queue</p>
                <h2 id="settlement-aging-title" className="mt-1.5 text-lg font-extrabold text-foreground">Pending aging</h2>
              </div>
              <AnimatedBadge tone="neutral">14 payouts</AnimatedBadge>
            </div>
            <ul className="mt-6 space-y-4">
              {pendingBuckets.map((bucket, index) => {
                const amount = Math.round(latestPoint.pendingAmount * (bucket.share / 100));
                return (
                  <li key={bucket.label}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-foreground">{bucket.label}</span>
                      <span className="font-bold text-foreground tabular-nums">{formatMoney(amount)}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-pill bg-muted" role="img" aria-label={`${bucket.label}: ${formatFullMoney(amount)}, ${bucket.payouts} payouts`}>
                      <motion.span
                        className={cn("block h-full rounded-pill", bucket.tone)}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bucket.share}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: index * 0.07 }}
                      />
                    </div>
                    <p className="mt-1 text-[0.625rem] text-muted-foreground">{bucket.share}% · {bucket.payouts} payouts{index === 3 ? " · SLA breached" : ""}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="payment-method-title" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Customer choice</p>
                <h2 id="payment-method-title" className="mt-1.5 text-lg font-extrabold text-foreground">Payment method mix</h2>
              </div>
              <CreditCard className="size-5 text-primary" aria-hidden="true" />
            </div>
            <ul className="mt-5 space-y-3.5">
              {paymentMethodMix.map((method, index) => {
                const amount = latestPoint.grossRevenue * (method.share / 100);
                return (
                  <li key={method.label} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-xs">
                    <span className="font-semibold text-foreground">{method.label}</span>
                    <span className="h-1.5 overflow-hidden rounded-pill bg-muted">
                      <motion.span className="block h-full rounded-pill bg-primary" initial={{ width: 0 }} whileInView={{ width: `${method.share}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} />
                    </span>
                    <span className="text-right font-bold text-muted-foreground tabular-nums">{formatMoney(amount)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
