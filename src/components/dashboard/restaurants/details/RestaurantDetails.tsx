"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  Drumstick,
  Egg,
  Leaf,
  MapPin,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { MenuPerformance } from "@/components/dashboard/restaurants/details/MenuPerformance";
import {
  OutletHierarchy,
  type OutletSummary,
} from "@/components/dashboard/restaurants/details/OutletHierarchy";
import { RestaurantPerformanceChart } from "@/components/dashboard/restaurants/details/RestaurantPerformanceChart";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  aggregateRestaurantSeries,
  getDashboardRestaurantDetail,
  type DetailMetric,
  type DetailPeriod,
  type RestaurantMenuItem,
  type RestaurantTrendPoint,
} from "@/data/dashboard-restaurant-details";
import {
  managedRestaurants,
  type ManagedRestaurant,
  type RestaurantPlan,
} from "@/data/dashboard-restaurants";
import {
  getRestaurantRegistrySnapshot,
  getServerRestaurantRegistrySnapshot,
  parseRestaurantRegistry,
  saveRestaurantRegistry,
  subscribeRestaurantRegistry,
} from "@/lib/dashboard/restaurant-registry";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

type DailyRange = 7 | 30;
type MonthlyRange = 6 | 12;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const plans: RestaurantPlan[] = ["Restaurant Pro", "Digital Presence", "QR Starter"];

const statusMeta = {
  active: { label: "Active account", className: "bg-success-soft text-success", dot: "bg-success" },
  inactive: { label: "Inactive account", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  blocked: { label: "Blocked account", className: "bg-danger-soft text-danger", dot: "bg-danger" },
  pending: { label: "Pending onboarding", className: "bg-warning-soft text-warning", dot: "bg-warning" },
} as const;

const membershipMeta = {
  active: { label: "Active membership", className: "bg-success-soft text-success" },
  expiring: { label: "Expiring soon", className: "bg-warning-soft text-warning" },
  expired: { label: "Membership expired", className: "bg-danger-soft text-danger" },
  not_started: { label: "Not started", className: "bg-muted text-muted-foreground" },
} as const;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string | null): string {
  return value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : "Not scheduled";
}

function formatCurrency(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)}K`;
  return currencyFormatter.format(value);
}

function percentDelta(current: number, previous: number): number {
  return previous ? ((current - previous) / previous) * 100 : 0;
}

function sumSeries(data: RestaurantTrendPoint[]) {
  return data.reduce(
    (total, point) => ({
      revenue: total.revenue + point.revenue,
      previousRevenue: total.previousRevenue + point.previousRevenue,
      completed: total.completed + point.completedOrders,
      previousCompleted: total.previousCompleted + point.previousCompletedOrders,
      cancelled: total.cancelled + point.cancelledOrders,
      previousCancelled: total.previousCancelled + point.previousCancelledOrders,
      visits: total.visits + point.customerVisits,
      previousVisits: total.previousVisits + point.previousCustomerVisits,
    }),
    {
      revenue: 0,
      previousRevenue: 0,
      completed: 0,
      previousCompleted: 0,
      cancelled: 0,
      previousCancelled: 0,
      visits: 0,
      previousVisits: 0,
    },
  );
}

function updateMenuDemand(items: RestaurantMenuItem[], completedOrders: number): RestaurantMenuItem[] {
  const sourceTotal = items.reduce((sum, item) => sum + item.orders, 0);
  if (!sourceTotal || !items.length) {
    return items.map((item) => ({ ...item, orders: 0, revenue: 0, bestseller: false }));
  }

  const exact = items.map((item) => completedOrders * (item.orders / sourceTotal));
  const orders = exact.map(Math.floor);
  const remainder = completedOrders - orders.reduce((sum, value) => sum + value, 0);
  const priority = exact
    .map((value, index) => ({ index, fraction: value - orders[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (let index = 0; index < remainder; index += 1) orders[priority[index % priority.length].index] += 1;
  const bestIndex = orders.reduce((best, value, index) => value > orders[best] ? index : best, 0);

  return items.map((item, index) => ({
    ...item,
    orders: orders[index],
    revenue: orders[index] * item.price,
    bestseller: index === bestIndex && orders[index] > 0,
  }));
}

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-control border border-white/10 bg-white/[0.055] p-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[0.5625rem] font-bold tracking-[0.11em] text-ink-muted uppercase">
        <Icon className="size-3.5 text-[var(--accent)]" aria-hidden="true" /> {label}
      </div>
      <p className="mt-2 truncate text-sm font-bold text-ink-foreground">{value}</p>
    </div>
  );
}

function PlanControl({
  restaurant,
  onPlanChange,
  onPlanToggle,
}: {
  restaurant: ManagedRestaurant;
  onPlanChange: (plan: RestaurantPlan) => void;
  onPlanToggle: () => void;
}) {
  const membership = membershipMeta[restaurant.membership];
  const activeMembership = restaurant.membership === "active" || restaurant.membership === "expiring";
  const planActive = (restaurant.planActive ?? activeMembership) && activeMembership;
  const cannotActivate = !planActive && (restaurant.membership === "expired" || restaurant.membership === "not_started");
  const explanation = restaurant.membership === "expired"
    ? "Renew the membership before activating this plan."
    : "Start the membership before activating this plan.";

  return (
    <aside aria-labelledby="plan-control-title" className="rounded-card border border-white/12 bg-white p-5 text-foreground shadow-lift sm:p-6">
      <div className="flex flex-col items-start gap-3">
        <div>
          <p className="text-[0.625rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Service plan</p>
          <h2 id="plan-control-title" className="mt-1.5 text-lg font-extrabold">Membership control</h2>
        </div>
        <span className={cn("rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", membership.className)}>{membership.label}</span>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.1em] text-muted-foreground uppercase">Current plan</span>
        <select
          value={restaurant.plan}
          onChange={(event) => onPlanChange(event.target.value as RestaurantPlan)}
          className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          {plans.map((plan) => <option key={plan}>{plan}</option>)}
        </select>
      </label>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-control bg-muted/70 p-3.5">
        <div>
          <p className="text-sm font-bold">Plan service</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{planActive ? "Enabled for this restaurant" : "Currently deactivated"}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={planActive}
          aria-disabled={cannotActivate}
          aria-describedby={cannotActivate ? "plan-service-help" : undefined}
          aria-label={`${planActive ? "Deactivate" : "Activate"} ${restaurant.plan} for ${restaurant.name}`}
          title={cannotActivate ? explanation : undefined}
          onClick={() => { if (!cannotActivate) onPlanToggle(); }}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-pill border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            planActive ? "border-success bg-success" : "border-border bg-card",
            cannotActivate && "cursor-not-allowed opacity-45",
          )}
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-soft"
            animate={{ x: planActive ? 20 : 0 }}
            transition={{ duration: 0.22 }}
          />
        </button>
      </div>

      {cannotActivate ? <p id="plan-service-help" className="mt-2 text-[0.6875rem] font-semibold text-warning">{explanation}</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div><p className="text-muted-foreground">Renewal</p><p className="mt-1 font-bold">{formatDate(restaurant.membershipExpiresAt)}</p></div>
        <div><p className="text-muted-foreground">Owner</p><p className="mt-1 truncate font-bold">{restaurant.ownerName}</p></div>
      </div>
    </aside>
  );
}

function MetricCard({
  label,
  value,
  note,
  delta,
  desirable,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  delta: number;
  desirable: "up" | "down";
  icon: typeof WalletCards;
  tone: string;
}) {
  const improved = desirable === "up" ? delta >= 0 : delta <= 0;
  const DeltaIcon = delta >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <SpotlightCard className="h-full">
      <article className="h-full p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("grid size-11 place-items-center rounded-control", tone)}><Icon className="size-5" aria-hidden="true" /></div>
          <div aria-label={`${Math.abs(delta).toFixed(1)} percent ${delta >= 0 ? "increase" : "decrease"} versus the previous period`} className={cn("inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", improved ? "bg-success-soft text-success" : "bg-danger-soft text-danger")}>
            <DeltaIcon className="size-3" aria-hidden="true" /> <span aria-hidden="true">{Math.abs(delta).toFixed(1)}%</span>
          </div>
        </div>
        <dl className="mt-5">
          <dt className="text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">{label}</dt>
          <dd className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-foreground tabular-nums">{value}</dd>
        </dl>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground">{note}</p>
          <span className={cn("h-1.5 w-12 overflow-hidden rounded-pill", improved ? "bg-success-soft" : "bg-danger-soft")} aria-hidden="true">
            <motion.span className={cn("block h-full rounded-pill", improved ? "bg-success" : "bg-danger")} initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 0.45 }} />
          </span>
        </div>
      </article>
    </SpotlightCard>
  );
}

function RemovedRestaurant({ restaurantId }: { restaurantId: string }) {
  return (
    <div className="mx-auto grid min-h-[65vh] w-full max-w-3xl place-items-center">
      <Reveal className="w-full rounded-panel border border-border bg-card p-7 text-center shadow-card sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-danger-soft text-danger"><Ban className="size-6" aria-hidden="true" /></span>
        <p className="mt-5 text-[0.625rem] font-bold tracking-[0.13em] text-danger uppercase">Restaurant unavailable</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground">This restaurant was removed locally</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">The exported detail route still exists, but this record was deleted from this browser&rsquo;s demo registry.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href={routes.dashboardRestaurants()} className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-border px-5 text-sm font-bold text-foreground hover:border-primary/40"><ArrowLeft className="size-4" aria-hidden="true" /> Back to directory</Link>
          <button type="button" onClick={() => saveRestaurantRegistry(managedRestaurants)} className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-bold text-primary-foreground"><RefreshCcw className="size-4" aria-hidden="true" /> Restore demo data</button>
        </div>
        <p className="mt-5 text-[0.625rem] text-muted-foreground">Record ID: {restaurantId}</p>
      </Reveal>
    </div>
  );
}

export function RestaurantDetails({ restaurantId }: { restaurantId: string }) {
  const snapshot = useSyncExternalStore(
    subscribeRestaurantRegistry,
    getRestaurantRegistrySnapshot,
    getServerRestaurantRegistrySnapshot,
  );
  const records = useMemo(() => parseRestaurantRegistry(snapshot), [snapshot]);
  const restaurant = records.find((record) => record.id === restaurantId);
  const detail = getDashboardRestaurantDetail(restaurantId);
  const [period, setPeriod] = useState<DetailPeriod>("daily");
  const [dailyRange, setDailyRange] = useState<DailyRange>(30);
  const [monthlyRange, setMonthlyRange] = useState<MonthlyRange>(6);
  const [selectedOutletId, setSelectedOutletId] = useState<"all" | string>("all");
  const [metric, setMetric] = useState<DetailMetric>("revenue");
  const [menuResetVersion, setMenuResetVersion] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const range = period === "daily" ? dailyRange : monthlyRange;
  const serviceOutlets = detail
    ? detail.outlets.map((outlet) => ({
        ...outlet,
        serviceStatus: restaurant?.status === "pending"
          ? "onboarding" as const
          : restaurant?.status === "active"
            ? "online" as const
            : "paused" as const,
      }))
    : [];
  const selectedOutlets = detail
    ? selectedOutletId === "all"
      ? serviceOutlets
      : serviceOutlets.filter((outlet) => outlet.id === selectedOutletId)
    : [];
  const series = detail ? aggregateRestaurantSeries(selectedOutlets, period).slice(-range) : [];
  const totals = sumSeries(series);
  const selectedOutlet = detail?.outlets.find((outlet) => outlet.id === selectedOutletId);
  const outletLabel = selectedOutlet?.name ?? "All outlets";
  const periodLabel = `${outletLabel} · Last ${range} ${period === "daily" ? "days" : "months"}`;

  const outletSummaries = detail
    ? Object.fromEntries(detail.outlets.map((outlet) => {
      const scoped = outlet[period].slice(-range);
      const total = sumSeries(scoped);
      return [outlet.id, { revenue: total.revenue, orders: total.completed, visits: total.visits } satisfies OutletSummary];
    }))
    : {};

  const scopedMenuItems = detail
    ? updateMenuDemand(
        detail.menuItems.filter((item) => selectedOutletId === "all" || item.outletIds.includes(selectedOutletId)),
        totals.completed,
      ).map((item) => ({
        ...item,
        available: restaurant?.status !== "blocked" && restaurant?.status !== "pending",
      }))
    : [];

  if (!restaurant || !detail) return <RemovedRestaurant restaurantId={restaurantId} />;

  const activeMembership = restaurant.membership === "active" || restaurant.membership === "expiring";
  const planActive = (restaurant.planActive ?? activeMembership) && activeMembership;
  const status = statusMeta[restaurant.status];
  const allOrders = totals.completed + totals.cancelled;
  const cancellationRate = allOrders ? (totals.cancelled / allOrders) * 100 : 0;
  const averageOrderValue = totals.completed ? totals.revenue / totals.completed : 0;
  const repeatVisitRate = Math.min(64, Math.round(35 + restaurant.rating * 3 + restaurant.outletCount * 2));

  const dietOrders = scopedMenuItems.reduce(
    (result, item) => ({ ...result, [item.diet]: result[item.diet] + item.orders }),
    { veg: 0, "non-veg": 0, egg: 0 },
  );
  const dietTotal = dietOrders.veg + dietOrders["non-veg"] + dietOrders.egg;
  const vegShare = dietTotal ? (dietOrders.veg / dietTotal) * 100 : 0;
  const nonVegShare = dietTotal ? (dietOrders["non-veg"] / dietTotal) * 100 : 0;
  const eggShare = Math.max(0, 100 - vegShare - nonVegShare);

  const bestOutlet = [...detail.outlets].sort((a, b) => (outletSummaries[b.id]?.revenue ?? 0) - (outletSummaries[a.id]?.revenue ?? 0))[0];
  const topItem = [...scopedMenuItems].sort((a, b) => b.orders - a.orders)[0];

  function updateRestaurant(patch: Partial<ManagedRestaurant>, message: string) {
    saveRestaurantRegistry(records.map((record) => record.id === restaurantId ? { ...record, ...patch } : record));
    setAnnouncement(message);
  }

  function resetFilters() {
    setPeriod("daily");
    setDailyRange(30);
    setMonthlyRange(6);
    setSelectedOutletId("all");
    setMetric("revenue");
    setMenuResetVersion((version) => version + 1);
  }

  const metricCards = [
    {
      label: "Total revenue",
      value: formatCurrency(totals.revenue),
      note: `${currencyFormatter.format(averageOrderValue)} average order value`,
      delta: percentDelta(totals.revenue, totals.previousRevenue),
      desirable: "up" as const,
      icon: WalletCards,
      tone: "bg-primary-soft text-primary-strong",
    },
    {
      label: "Completed orders",
      value: compactFormatter.format(totals.completed),
      note: `${allOrders.toLocaleString("en-IN")} total order attempts`,
      delta: percentDelta(totals.completed, totals.previousCompleted),
      desirable: "up" as const,
      icon: CheckCircle2,
      tone: "bg-success-soft text-success",
    },
    {
      label: "Cancelled orders",
      value: compactFormatter.format(totals.cancelled),
      note: `${cancellationRate.toFixed(1)}% cancellation rate`,
      delta: percentDelta(totals.cancelled, totals.previousCancelled),
      desirable: "down" as const,
      icon: CircleAlert,
      tone: "bg-danger-soft text-danger",
    },
    {
      label: "Customer visits",
      value: compactFormatter.format(totals.visits),
      note: `${repeatVisitRate}% restaurant-wide repeat estimate`,
      delta: percentDelta(totals.visits, totals.previousVisits),
      desirable: "up" as const,
      icon: UsersRound,
      tone: "bg-warning-soft text-warning",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <Link href={routes.dashboardRestaurants()} className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Restaurant directory
      </Link>

      <Reveal as="header" className="relative isolate overflow-hidden rounded-panel bg-ink p-5 text-ink-foreground shadow-lift sm:p-7 lg:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_110%_at_82%_10%,rgb(var(--primary-rgb)/0.4),transparent_72%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-28 right-[-4rem] -z-10 size-80 rounded-full border border-white/8" />
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", status.className)}><span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />{status.label}</span>
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[0.625rem] font-bold text-[var(--accent)]"><Star className="size-3 fill-star text-star" aria-hidden="true" /> {restaurant.rating ? `${restaurant.rating.toFixed(1)} rating` : "New restaurant"}</span>
              <span className="inline-flex rounded-pill border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[0.625rem] font-bold text-ink-muted">{detail.cuisines.join(" · ")}</span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-card border border-white/10 bg-white/[0.075] text-base font-extrabold text-[var(--accent)] shadow-soft sm:size-16 sm:text-lg">{getInitials(restaurant.name)}</span>
              <div className="min-w-0">
                <p className="text-[0.625rem] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">Restaurant overview</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.045em] sm:text-4xl lg:text-5xl">{restaurant.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted"><MapPin className="size-4" aria-hidden="true" /> {restaurant.locality}, {restaurant.city}</p>
              </div>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Fact icon={MapPin} label="Location" value={`${restaurant.locality}, ${restaurant.city}`} />
              <Fact icon={CalendarDays} label="Joined" value={formatDate(restaurant.joinedAt)} />
              <Fact icon={CreditCard} label={restaurant.membership === "expired" ? "Membership ended" : "Membership renews"} value={formatDate(restaurant.membershipExpiresAt)} />
              <Fact icon={Building2} label="Outlet network" value={`${detail.outlets.length} ${detail.outlets.length === 1 ? "outlet" : "outlets"}`} />
            </div>
          </div>

          <PlanControl
            restaurant={restaurant}
            onPlanChange={(plan) => updateRestaurant({ plan }, `${restaurant.name} now uses ${plan}.`)}
            onPlanToggle={() => updateRestaurant({ planActive: !planActive }, `${restaurant.plan} was ${planActive ? "deactivated" : "activated"}.`)}
          />
        </div>
      </Reveal>

      <Reveal as="section" className="mt-5 rounded-panel border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <fieldset>
            <legend className="mb-1.5 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Granularity</legend>
            <div className="flex h-11 rounded-control bg-muted p-1">
              {(["daily", "monthly"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setPeriod(value)} aria-pressed={period === value} className={cn("rounded-[0.55rem] px-4 text-xs font-bold transition-colors", period === value ? "bg-card text-primary-strong shadow-soft" : "text-muted-foreground hover:text-foreground")}>{value === "daily" ? "Daily" : "Monthly"}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Date range</legend>
            <div className="flex h-11 rounded-control bg-muted p-1">
              {(period === "daily" ? [7, 30] as const : [6, 12] as const).map((value) => {
                const selected = period === "daily" ? dailyRange === value : monthlyRange === value;
                return <button key={value} type="button" onClick={() => period === "daily" ? setDailyRange(value as DailyRange) : setMonthlyRange(value as MonthlyRange)} aria-pressed={selected} className={cn("rounded-[0.55rem] px-4 text-xs font-bold transition-colors", selected ? "bg-card text-primary-strong shadow-soft" : "text-muted-foreground hover:text-foreground")}>{value}{period === "daily" ? "D" : "M"}</button>;
              })}
            </div>
          </fieldset>

          <label className="min-w-[14rem] flex-1 xl:max-w-xs">
            <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Outlet scope</span>
            <select value={selectedOutletId} onChange={(event) => setSelectedOutletId(event.target.value)} className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option value="all">All outlets</option>
              {serviceOutlets.map((outlet) => <option key={outlet.id} value={outlet.id}>{outlet.name}{outlet.isMainBranch ? " · Main branch" : ""}</option>)}
            </select>
          </label>

          <button type="button" onClick={resetFilters} className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-border px-4 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong xl:ml-auto"><RotateCcw className="size-4" aria-hidden="true" /> Reset all</button>
        </div>
        <p className="mt-4 border-t border-border pt-3 text-xs font-semibold text-muted-foreground" aria-live="polite"><span className="mr-2 inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />{periodLabel} · KPIs, charts, outlet comparison and menu demand use this scope</p>
      </Reveal>

      <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" stagger={0.05}>
        {metricCards.map((card) => <RevealItem key={card.label}><MetricCard {...card} /></RevealItem>)}
      </RevealGroup>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.68fr)]">
        <Reveal><RestaurantPerformanceChart data={series} metric={metric} onMetricChange={setMetric} periodLabel={periodLabel} /></Reveal>
        <Reveal as="section" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Diet intelligence</p><h2 className="mt-1.5 text-lg font-extrabold text-foreground">Menu order mix</h2><p className="mt-1 text-xs text-muted-foreground">Demand split for the selected scope.</p></div>
            <Sparkles className="size-5 text-primary-strong" aria-hidden="true" />
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative size-40 shrink-0 rounded-full p-4 shadow-soft" style={{ background: dietTotal ? `conic-gradient(var(--success) 0 ${vegShare}%, var(--danger) ${vegShare}% ${vegShare + nonVegShare}%, var(--warning) ${vegShare + nonVegShare}% 100%)` : "var(--muted)" }} role="img" aria-label={`${vegShare.toFixed(0)} percent veg, ${nonVegShare.toFixed(0)} percent non-veg, ${eggShare.toFixed(0)} percent egg`}>
              <div className="grid size-full place-items-center rounded-full bg-card text-center"><div><strong className="block text-2xl font-extrabold text-foreground tabular-nums">{compactFormatter.format(dietTotal)}</strong><span className="text-[0.625rem] font-bold text-muted-foreground uppercase">item orders</span></div></div>
            </div>
            <dl className="w-full space-y-3">
              {[
                { label: "Veg", value: dietOrders.veg, share: vegShare, icon: Leaf, tone: "text-success", dot: "bg-success" },
                { label: "Non-veg", value: dietOrders["non-veg"], share: nonVegShare, icon: Drumstick, tone: "text-danger", dot: "bg-danger" },
                { label: "Egg", value: dietOrders.egg, share: eggShare, icon: Egg, tone: "text-warning", dot: "bg-warning" },
              ].map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="flex items-center gap-3"><span className={cn("grid size-8 place-items-center rounded-control bg-muted", item.tone)}><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><dt className="text-xs font-bold text-foreground">{item.label}</dt><dd className="mt-0.5 text-[0.625rem] text-muted-foreground tabular-nums">{item.value.toLocaleString("en-IN")} orders</dd></div><strong className="text-sm text-foreground tabular-nums">{item.share.toFixed(0)}%</strong></div>;
              })}
            </dl>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4">
            <div><dt className="text-[0.5625rem] font-bold text-muted-foreground uppercase">Avg ticket</dt><dd className="mt-1 text-sm font-extrabold text-foreground tabular-nums">{currencyFormatter.format(averageOrderValue)}</dd></div>
            <div title="Restaurant-wide estimated repeat visits"><dt className="text-[0.5625rem] font-bold text-muted-foreground uppercase">Est. repeat</dt><dd className="mt-1 text-sm font-extrabold text-foreground tabular-nums">{repeatVisitRate}%</dd></div>
            <div><dt className="text-[0.5625rem] font-bold text-muted-foreground uppercase">Cancelled</dt><dd className="mt-1 text-sm font-extrabold text-foreground tabular-nums">{cancellationRate.toFixed(1)}%</dd></div>
          </dl>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5">
        <Reveal><OutletHierarchy restaurantName={restaurant.name} outlets={serviceOutlets} summaries={outletSummaries} selectedOutletId={selectedOutletId} onSelect={setSelectedOutletId} /></Reveal>
        <Reveal as="section" className="overflow-hidden rounded-panel border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div><p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Network comparison</p><h2 className="mt-1.5 text-lg font-extrabold text-foreground">Outlet performance</h2><p className="mt-1 text-xs text-muted-foreground">Select an outlet name to focus the complete report.</p></div>
            <span className="inline-flex w-fit items-center gap-2 rounded-pill bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary-strong"><Store className="size-3.5" aria-hidden="true" /> {detail.outlets.length} locations</span>
          </div>
          <div role="region" aria-label="Outlet performance table. Scroll horizontally to see every column." tabIndex={0} className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
            <table className="w-full min-w-[48rem] table-fixed border-collapse text-left">
              <caption className="sr-only">Revenue, completed orders, cancellations and customer visits by outlet</caption>
              <colgroup><col className="w-[27%]" /><col className="w-[17%]" /><col className="w-[15%]" /><col className="w-[14%]" /><col className="w-[14%]" /><col className="w-[13%]" /></colgroup>
              <thead><tr className="bg-muted/55 text-[0.625rem] font-bold tracking-[0.1em] text-muted-foreground uppercase"><th scope="col" className="px-5 py-3.5 sm:pl-6">Outlet</th><th scope="col" className="px-3 py-3.5">Revenue</th><th scope="col" className="px-3 py-3.5">Completed</th><th scope="col" className="px-3 py-3.5">Cancelled</th><th scope="col" className="px-3 py-3.5">Visits</th><th scope="col" className="px-3 py-3.5 pr-5">Share</th></tr></thead>
              <tbody>{detail.outlets.map((outlet) => {
                const scoped = outlet[period].slice(-range);
                const total = sumSeries(scoped);
                const share = totals.revenue ? (total.revenue / sumSeries(aggregateRestaurantSeries(detail.outlets, period).slice(-range)).revenue) * 100 : 0;
                const selected = selectedOutletId === outlet.id;
                return <tr key={outlet.id} className={cn("border-t border-border/80 transition-colors hover:bg-primary-soft/35", selected && "bg-primary-soft/55")}><th scope="row" className="px-5 py-4 font-normal sm:pl-6"><button type="button" onClick={() => setSelectedOutletId(outlet.id)} aria-pressed={selected} className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="block text-sm font-extrabold text-foreground">{outlet.name}</span><span className="mt-0.5 block text-[0.625rem] text-muted-foreground">{outlet.isMainBranch ? "Main branch" : outlet.locality} · {outlet.seatingCapacity} seats</span></button></th><td className="px-3 py-4 text-sm font-bold text-foreground tabular-nums">{formatCurrency(total.revenue)}</td><td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{total.completed.toLocaleString("en-IN")}</td><td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{total.cancelled.toLocaleString("en-IN")}</td><td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{total.visits.toLocaleString("en-IN")}</td><td className="px-3 py-4 pr-5 text-sm font-bold text-foreground tabular-nums">{share.toFixed(0)}%</td></tr>;
              })}</tbody>
            </table>
          </div>
        </Reveal>
      </div>

      <RevealGroup className="mt-5 grid gap-3 md:grid-cols-3" stagger={0.05}>
        <RevealItem><div className="flex h-full items-start gap-3 rounded-card border border-border bg-card p-5 shadow-card"><span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-strong"><Building2 className="size-5" aria-hidden="true" /></span><div><p className="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">Top outlet</p><p className="mt-1 text-sm font-extrabold text-foreground">{bestOutlet?.name ?? "Awaiting launch"}</p><p className="mt-1 text-xs text-muted-foreground">{bestOutlet ? `${formatCurrency(outletSummaries[bestOutlet.id]?.revenue ?? 0)} in scoped revenue` : "No outlet data"}</p></div></div></RevealItem>
        <RevealItem><div className="flex h-full items-start gap-3 rounded-card border border-border bg-card p-5 shadow-card"><span className="grid size-10 shrink-0 place-items-center rounded-control bg-warning-soft text-warning"><ShoppingBag className="size-5" aria-hidden="true" /></span><div><p className="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">Top menu item</p><p className="mt-1 text-sm font-extrabold text-foreground">{topItem?.name ?? "Awaiting demand"}</p><p className="mt-1 text-xs text-muted-foreground">{topItem ? `${topItem.orders.toLocaleString("en-IN")} orders · ${currencyFormatter.format(topItem.price)}` : "No menu demand yet"}</p></div></div></RevealItem>
        <RevealItem><div className="flex h-full items-start gap-3 rounded-card border border-border bg-card p-5 shadow-card"><span className={cn("grid size-10 shrink-0 place-items-center rounded-control", planActive ? "bg-success-soft text-success" : "bg-danger-soft text-danger")}><Clock3 className="size-5" aria-hidden="true" /></span><div><p className="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">Plan pulse</p><p className="mt-1 text-sm font-extrabold text-foreground">{restaurant.plan} · {planActive ? "Active" : "Inactive"}</p><p className="mt-1 text-xs text-muted-foreground">{restaurant.membershipExpiresAt ? `${restaurant.membership === "expired" ? "Ended" : "Renews"} ${formatDate(restaurant.membershipExpiresAt)}` : "Activation pending"}</p></div></div></RevealItem>
      </RevealGroup>

      <Reveal className="mt-5"><MenuPerformance key={menuResetVersion} items={scopedMenuItems} outletLabel={outletLabel} /></Reveal>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
