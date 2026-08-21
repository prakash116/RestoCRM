"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  CalendarRange,
  ChartNoAxesCombined,
  CircleAlert,
  Clock3,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Store,
  TrendingUp,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";

import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  analyticsPeriods,
  analyticsScopeFactors,
  analyticsSeries,
  ratingDistribution,
  restaurantPerformance,
  type AnalyticsMetric,
  type AnalyticsPeriod,
  type AnalyticsPoint,
  type MembershipStatus,
} from "@/data/analytics";
import { cn } from "@/lib/utils/cn";

import { AnalyticsAmbientLoader } from "./AnalyticsAmbientLoader";
import { PerformanceChart } from "./PerformanceChart";

type CityFilter = keyof typeof analyticsScopeFactors.city;
type PlanFilter = keyof typeof analyticsScopeFactors.plan;
type StatusFilter = "All" | MembershipStatus;

interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: LucideIcon;
  tone: "brand" | "success" | "warning" | "neutral" | "star";
  direction: "up" | "down";
  favourable: boolean;
  sparkline: number[];
}

const cityOptions: CityFilter[] = ["All", "Delhi", "Gurugram", "Noida", "Faridabad"];
const planOptions: PlanFilter[] = ["All", "Starter", "Growth", "Pro", "Enterprise"];
const statusOptions: StatusFilter[] = ["All", "Active", "Expiring", "Expired"];

function formatLakhs(value: number): string {
  if (value < 100_000) return `₹${Math.round(value / 1_000)}K`;
  return `₹${(value / 100_000).toFixed(2)}L`;
}

function formatIndianCompact(value: number): string {
  if (value >= 100_000) return `${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)}K`;
  return Math.round(value).toLocaleString("en-IN");
}

function scaleSeries(data: AnalyticsPoint[], factor: number): AnalyticsPoint[] {
  return data.map((point) => ({
    ...point,
    revenue: Math.round(point.revenue * factor),
    previousRevenue: Math.round(point.previousRevenue * factor),
    customers: Math.max(1, Math.round(point.customers * factor)),
    restaurants: Math.max(1, Math.round(point.restaurants * factor)),
  }));
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

function MetricCardView({ metric, scopeKey }: { metric: MetricCard; scopeKey: string }) {
  const Icon = metric.icon;
  const DirectionIcon = metric.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const toneClasses = {
    brand: "bg-primary-soft text-primary-strong",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    neutral: "bg-secondary text-secondary-foreground",
    star: "bg-warning-soft text-star",
  } as const;

  return (
    <SpotlightCard className="h-full p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-control", toneClasses[metric.tone])}>
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
      <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-bold tabular-nums",
            metric.favourable ? "text-success" : "text-danger",
          )}
        >
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
    <label htmlFor={id} className="block min-w-[9rem] flex-1 sm:flex-none">
      <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-control border border-input bg-card px-3 text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary/40 focus:border-primary focus:outline-none sm:w-40"
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

export function AnalyticsReport() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [city, setCity] = useState<CityFilter>("All");
  const [plan, setPlan] = useState<PlanFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [metric, setMetric] = useState<AnalyticsMetric>("revenue");

  const scopeFactor = analyticsScopeFactors.city[city] * analyticsScopeFactors.plan[plan];
  const scopeKey = `${period}-${city}-${plan}-${status}`;
  const periodLabel = analyticsPeriods.find((item) => item.id === period)?.fullLabel ?? "Selected period";
  const chartData = useMemo(
    () => scaleSeries(analyticsSeries[period], scopeFactor),
    [period, scopeFactor],
  );
  const latestPoint = chartData.at(-1)!;

  const filteredRestaurants = useMemo(
    () =>
      restaurantPerformance.filter(
        (restaurant) =>
          (city === "All" || restaurant.city === city) &&
          (plan === "All" || restaurant.plan === plan) &&
          (status === "All" || restaurant.status === status),
      ),
    [city, plan, status],
  );

  const activeRestaurants = Math.max(1, Math.round(184 * scopeFactor));
  const expiringMemberships = Math.max(1, Math.round(15 * scopeFactor));
  const expiredMemberships = Math.max(1, Math.round(13 * scopeFactor));
  const totalRestaurants = activeRestaurants + expiringMemberships + expiredMemberships;
  const averageRating = 4.54 + scopeFactor * 0.08;

  const metrics: MetricCard[] = [
    {
      id: "revenue",
      label: "Revenue",
      value: formatLakhs(latestPoint.revenue),
      change: "+12.8%",
      comparison: "vs previous period",
      icon: BadgeIndianRupee,
      tone: "brand",
      direction: "up",
      favourable: true,
      sparkline: chartData.slice(-7).map((point) => point.revenue),
    },
    {
      id: "onboarded",
      label: "Onboarded restaurants",
      value: String(Math.max(1, Math.round(28 * scopeFactor))),
      change: "+16.7%",
      comparison: "ahead of target",
      icon: UserPlus,
      tone: "success",
      direction: "up",
      favourable: true,
      sparkline: [8, 11, 10, 15, 18, 22, 28].map((value) => value * scopeFactor),
    },
    {
      id: "active",
      label: "Active restaurants",
      value: activeRestaurants.toLocaleString("en-IN"),
      change: "+5.1%",
      comparison: "network growth",
      icon: Store,
      tone: "brand",
      direction: "up",
      favourable: true,
      sparkline: chartData.slice(-7).map((point) => point.restaurants),
    },
    {
      id: "expired",
      label: "Expired memberships",
      value: expiredMemberships.toLocaleString("en-IN"),
      change: "−18.8%",
      comparison: "fewer expiries",
      icon: CircleAlert,
      tone: "warning",
      direction: "down",
      favourable: true,
      sparkline: [21, 19, 20, 17, 16, 15, 13].map((value) => value * scopeFactor),
    },
    {
      id: "customers",
      label: "Total customers",
      value: formatIndianCompact(latestPoint.customers),
      change: "+21.4%",
      comparison: "customer reach",
      icon: UsersRound,
      tone: "neutral",
      direction: "up",
      favourable: true,
      sparkline: chartData.slice(-7).map((point) => point.customers),
    },
    {
      id: "rating",
      label: "Average rating",
      value: `${averageRating.toFixed(2)}/5`,
      change: "+0.18",
      comparison: "across all reviews",
      icon: Star,
      tone: "star",
      direction: "up",
      favourable: true,
      sparkline: [4.31, 4.35, 4.34, 4.43, 4.48, 4.56, averageRating],
    },
  ];

  const filtersActive = city !== "All" || plan !== "All" || status !== "All";

  function resetFilters() {
    setCity("All");
    setPlan("All");
    setStatus("All");
  }

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <Reveal as="header" className="relative isolate overflow-hidden rounded-panel bg-ink px-5 py-7 text-ink-foreground shadow-lift sm:px-7 sm:py-9 lg:px-9 lg:py-10">
        <AnalyticsAmbientLoader />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(105deg,var(--ink)_20%,rgb(var(--ink-rgb)/0.94)_54%,rgb(var(--primary-rgb)/0.3))]"
        />
        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.7fr)]">
          <div>
            <AnimatedBadge tone="inverse" pulse>
              Overall reports
            </AnimatedBadge>
            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              One view of every restaurant.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
              Revenue, memberships, customer growth and ratings — connected into one live network pulse.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-3.5" aria-hidden="true" /> Updated 2 minutes ago
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" /> All systems reporting
              </span>
            </div>
          </div>

          <div className="rounded-card border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-ink-muted uppercase">Network coverage</p>
                <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] tabular-nums">98.6%</p>
              </div>
              <ChartNoAxesCombined className="size-8 text-[var(--accent)]" aria-hidden="true" />
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-pill bg-white/10">
              <motion.div
                className="h-full rounded-pill bg-[var(--accent)]"
                initial={{ width: 0 }}
                animate={{ width: "98.6%" }}
                transition={{ duration: 0.8, delay: 0.15 }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-[0.625rem] font-bold tracking-wider text-ink-muted uppercase">Reporting</p>
                <p className="mt-1 text-sm font-bold tabular-nums">209 / 212</p>
              </div>
              <div>
                <p className="text-[0.625rem] font-bold tracking-wider text-ink-muted uppercase">Signal</p>
                <p className="mt-1 text-sm font-bold text-success-on-ink">Healthy</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="mt-5 rounded-card border border-border bg-card p-4 shadow-card sm:p-5">
        <h2 className="sr-only">Report filters</h2>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
          <fieldset>
            <legend className="mb-1.5 flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              <CalendarRange className="size-3.5" aria-hidden="true" /> Report period
            </legend>
            <div className="flex rounded-control bg-muted p-1">
              {analyticsPeriods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPeriod(item.id)}
                  aria-pressed={period === item.id}
                  className={cn(
                    "h-9 rounded-[0.55rem] px-3.5 text-xs font-bold transition-[background-color,color,box-shadow] sm:px-4",
                    period === item.id
                      ? "bg-card text-primary-strong shadow-soft"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-1 flex-wrap gap-3">
            <SelectFilter id="analytics-city" label="Cities" value={city} options={cityOptions} onChange={(value) => setCity(value as CityFilter)} />
            <SelectFilter id="analytics-plan" label="Plans" value={plan} options={planOptions} onChange={(value) => setPlan(value as PlanFilter)} />
            <SelectFilter id="analytics-status" label="Statuses" value={status} options={statusOptions} onChange={(value) => setStatus(value as StatusFilter)} />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!filtersActive}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reset
          </button>
        </div>
        <p aria-live="polite" className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Showing {periodLabel.toLowerCase()} · {city === "All" ? "all cities" : city} · {plan === "All" ? "all plans" : `${plan} plan`} · {status === "All" ? "all statuses" : status.toLowerCase()}
        </p>
      </Reveal>

      <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" stagger={0.045}>
        {metrics.map((item) => (
          <RevealItem key={item.id}>
            <MetricCardView metric={item} scopeKey={scopeKey} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal as="section" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(18rem,0.65fr)]">
        <PerformanceChart data={chartData} metric={metric} onMetricChange={setMetric} periodLabel={periodLabel} />

        <section aria-labelledby="membership-health-title" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Memberships</p>
              <h2 id="membership-health-title" className="mt-1.5 text-lg font-extrabold text-foreground">Health overview</h2>
            </div>
            <AnimatedBadge tone="success" pulse>Live</AnimatedBadge>
          </div>

          <div className="mt-7 grid place-items-center">
            <div
              role="img"
              aria-label={`${activeRestaurants} active, ${expiringMemberships} expiring and ${expiredMemberships} expired memberships`}
              className="relative grid size-40 place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--success) 0 ${(activeRestaurants / totalRestaurants) * 100}%, var(--warning) ${(activeRestaurants / totalRestaurants) * 100}% ${((activeRestaurants + expiringMemberships) / totalRestaurants) * 100}%, var(--danger) ${((activeRestaurants + expiringMemberships) / totalRestaurants) * 100}% 100%)`,
              }}
            >
              <span className="absolute inset-[0.7rem] rounded-full bg-card" aria-hidden="true" />
              <span className="relative text-center">
                <strong className="block text-3xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">{totalRestaurants}</strong>
                <span className="mt-0.5 block text-[0.625rem] font-bold tracking-wider text-muted-foreground uppercase">Total plans</span>
              </span>
            </div>
          </div>

          <ul className="mt-7 space-y-3">
            {[
              { label: "Active", value: activeRestaurants, color: "bg-success", note: `${((activeRestaurants / totalRestaurants) * 100).toFixed(1)}%` },
              { label: "Expiring soon", value: expiringMemberships, color: "bg-warning", note: "next 30 days" },
              { label: "Expired", value: expiredMemberships, color: "bg-danger", note: "needs action" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-control bg-muted/70 px-3.5 py-3">
                <span className={cn("size-2 rounded-full", item.color)} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-foreground">{item.label}</span>
                  <span className="block text-[0.625rem] text-muted-foreground">{item.note}</span>
                </span>
                <strong className="text-sm font-extrabold text-foreground tabular-nums">{item.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal as="section" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.58fr)]">
        <section aria-labelledby="top-restaurants-title" className="min-w-0 overflow-hidden rounded-panel border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Leaderboard</p>
              <h2 id="top-restaurants-title" className="mt-1.5 text-lg font-extrabold text-foreground">Top restaurants</h2>
              <p className="mt-1 text-xs text-muted-foreground">Ranked by revenue across the selected scope.</p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground tabular-nums">{filteredRestaurants.length} results</p>
          </div>

          {filteredRestaurants.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <caption className="sr-only">Top-performing restaurants with revenue, customer, rating, growth and membership data</caption>
                <thead>
                  <tr className="bg-muted/55 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">
                    <th scope="col" className="px-5 py-3.5 sm:pl-6">Rank</th>
                    <th scope="col" className="px-3 py-3.5">Restaurant</th>
                    <th scope="col" className="px-3 py-3.5">Revenue</th>
                    <th scope="col" className="px-3 py-3.5">Customers</th>
                    <th scope="col" className="px-3 py-3.5">Rating</th>
                    <th scope="col" className="px-3 py-3.5">Trend</th>
                    <th scope="col" className="px-3 py-3.5 pr-5 sm:pr-6">Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.map((restaurant, index) => (
                    <tr key={restaurant.id} className="group border-t border-border/80 transition-colors hover:bg-primary-soft/40">
                      <td className="px-5 py-4 sm:pl-6">
                        <span className={cn("grid size-7 place-items-center rounded-full text-xs font-extrabold", index < 3 ? "bg-primary-soft text-primary-strong" : "bg-muted text-muted-foreground")}>#{index + 1}</span>
                      </td>
                      <th scope="row" className="px-3 py-4 font-normal">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-control bg-ink text-xs font-extrabold text-ink-foreground">{restaurant.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                          <span>
                            <span className="block text-sm font-bold text-foreground">{restaurant.name}</span>
                            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{restaurant.locality}, {restaurant.city}</span>
                          </span>
                        </div>
                      </th>
                      <td className="px-3 py-4 text-sm font-bold text-foreground tabular-nums">{formatLakhs(restaurant.revenue)}</td>
                      <td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{formatIndianCompact(restaurant.customers)}</td>
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-foreground tabular-nums"><Star className="size-3.5 fill-star text-star" aria-hidden="true" />{restaurant.rating.toFixed(1)}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <Sparkline values={restaurant.sparkline} negative={restaurant.growth < 0} />
                          <span className={cn("inline-flex items-center text-xs font-bold tabular-nums", restaurant.growth >= 0 ? "text-success" : "text-danger")}>
                            {restaurant.growth >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
                            {Math.abs(restaurant.growth).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 pr-5 sm:pr-6">
                        <span className={cn("inline-flex rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", restaurant.status === "Active" ? "bg-success-soft text-success" : restaurant.status === "Expiring" ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger")}>{restaurant.plan} · {restaurant.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center px-6 text-center">
              <div>
                <Store className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-foreground">No restaurants match</p>
                <p className="mt-1 text-xs text-muted-foreground">Reset the filters to restore the complete leaderboard.</p>
                <button type="button" onClick={resetFilters} className="mt-4 text-xs font-bold text-primary-strong hover:underline">Reset filters</button>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="rating-overview-title" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
          <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Customer voice</p>
          <h2 id="rating-overview-title" className="mt-1.5 text-lg font-extrabold text-foreground">Rating overview</h2>

          <div className="mt-6 flex items-end gap-3 border-b border-border pb-5">
            <strong className="text-4xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">{averageRating.toFixed(2)}</strong>
            <div className="pb-1">
              <div className="flex gap-0.5 text-star" aria-label={`${averageRating.toFixed(2)} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" aria-hidden="true" />)}
              </div>
              <p className="mt-1 text-[0.625rem] text-muted-foreground">18.6K verified reviews</p>
            </div>
          </div>

          <ul className="mt-5 space-y-3.5">
            {ratingDistribution.map((bucket) => (
              <li key={bucket.stars} className="grid grid-cols-[1.75rem_1fr_2.25rem] items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-foreground">{bucket.stars}<Star className="size-3 fill-star text-star" aria-hidden="true" /></span>
                <span className="h-2 overflow-hidden rounded-pill bg-muted">
                  <motion.span
                    className="block h-full rounded-pill bg-star"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bucket.share}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: (5 - bucket.stars) * 0.04 }}
                  />
                </span>
                <span className="text-right font-semibold text-muted-foreground tabular-nums">{bucket.share}%</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-card bg-success-soft p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-success"><TrendingUp className="size-4" aria-hidden="true" />87% positive sentiment</div>
            <p className="mt-1.5 text-xs leading-relaxed text-success">Service mentions improved most this period, followed by food quality.</p>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
