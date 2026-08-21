"use client";

import { Building2, GitBranch, MapPin, Store } from "lucide-react";

import type { RestaurantOutletDetail } from "@/data/dashboard-restaurant-details";
import { cn } from "@/lib/utils/cn";

export interface OutletSummary {
  revenue: number;
  orders: number;
  visits: number;
}

function compactCurrency(value: number): string {
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `₹${Math.round(value / 1_000)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function OutletHierarchy({
  restaurantName,
  outlets,
  summaries,
  selectedOutletId,
  onSelect,
}: {
  restaurantName: string;
  outlets: RestaurantOutletDetail[];
  summaries: Record<string, OutletSummary>;
  selectedOutletId: "all" | string;
  onSelect: (outletId: "all" | string) => void;
}) {
  const total = outlets.reduce(
    (result, outlet) => ({
      revenue: result.revenue + (summaries[outlet.id]?.revenue ?? 0),
      orders: result.orders + (summaries[outlet.id]?.orders ?? 0),
      visits: result.visits + (summaries[outlet.id]?.visits ?? 0),
    }),
    { revenue: 0, orders: 0, visits: 0 },
  );

  return (
    <section aria-labelledby="outlet-hierarchy-title" className="overflow-hidden rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Network structure</p>
          <h2 id="outlet-hierarchy-title" className="mt-1.5 text-lg font-extrabold text-foreground">Outlet hierarchy</h2>
          <p className="mt-1 text-xs text-muted-foreground">Select any node to filter the complete report.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-strong">
          <GitBranch className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6">
        <div className="mx-auto max-w-sm">
          <button
            type="button"
            onClick={() => onSelect("all")}
            aria-pressed={selectedOutletId === "all"}
            className={cn(
              "w-full rounded-card border p-4 text-left transition-[transform,border-color,box-shadow,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selectedOutletId === "all"
                ? "border-primary/40 bg-primary-soft shadow-soft"
                : "border-border bg-card hover:border-primary/25",
            )}
          >
            <span className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-control bg-ink text-ink-foreground">
                <Building2 className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.625rem] font-bold tracking-wide text-primary-strong uppercase">Restaurant group</span>
                <span className="mt-0.5 block truncate text-sm font-extrabold text-foreground">{restaurantName}</span>
              </span>
              <span className="text-right">
                <strong className="block text-sm font-extrabold text-foreground tabular-nums">{compactCurrency(total.revenue)}</strong>
                <span className="text-[0.625rem] text-muted-foreground tabular-nums">{total.orders} orders</span>
              </span>
            </span>
          </button>
        </div>

        <div aria-hidden="true" className="mx-auto hidden h-6 w-px bg-border sm:block" />
        {outlets.length > 1 ? <div aria-hidden="true" className="mx-auto hidden h-px bg-border sm:block" style={{ width: `${Math.max(44, 100 - 100 / outlets.length)}%` }} /> : null}

        <div className={cn(
          "relative mt-4 grid gap-3 border-l border-border pl-4 sm:mt-0 sm:border-l-0 sm:pl-0",
          outlets.length === 2 && "sm:grid-cols-2",
          outlets.length >= 3 && "sm:grid-cols-3",
        )}>
          {outlets.map((outlet) => {
            const selected = selectedOutletId === outlet.id;
            const summary = summaries[outlet.id] ?? { revenue: 0, orders: 0, visits: 0 };
            return (
              <div key={outlet.id} className="relative pt-0 sm:pt-6">
                <span aria-hidden="true" className="absolute top-1/2 -left-4 h-px w-4 bg-border sm:top-0 sm:left-1/2 sm:h-6 sm:w-px" />
                <button
                  type="button"
                  onClick={() => onSelect(outlet.id)}
                  aria-pressed={selected}
                  className={cn(
                    "h-full w-full rounded-card border p-4 text-left transition-[transform,border-color,box-shadow,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    selected
                      ? "border-primary/40 bg-primary-soft shadow-soft"
                      : "border-border bg-card hover:border-primary/25",
                  )}
                >
                  <span className="flex items-start gap-3">
                    <span className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-control",
                      outlet.isMainBranch ? "bg-primary-soft text-primary-strong" : "bg-muted text-muted-foreground",
                    )}>
                      <Store className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-sm font-extrabold text-foreground">{outlet.name}</strong>
                        {outlet.isMainBranch ? <span className="rounded-pill bg-primary-soft px-2 py-0.5 text-[0.5625rem] font-bold text-primary-strong">Main branch</span> : null}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[0.625rem] text-muted-foreground"><MapPin className="size-3" aria-hidden="true" />{outlet.locality}</span>
                    </span>
                    <span className={cn(
                      "mt-0.5 rounded-pill px-2 py-0.5 text-[0.5625rem] font-bold",
                      outlet.serviceStatus === "online"
                        ? "bg-success-soft text-success"
                        : outlet.serviceStatus === "onboarding"
                          ? "bg-warning-soft text-warning"
                          : "bg-danger-soft text-danger",
                    )}>
                      {outlet.serviceStatus === "online" ? "Online" : outlet.serviceStatus === "onboarding" ? "Onboarding" : "Paused"}
                    </span>
                  </span>
                  <span className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                    <span><span className="block text-[0.5625rem] font-bold tracking-wide text-muted-foreground uppercase">Revenue</span><strong className="mt-1 block text-xs text-foreground tabular-nums">{compactCurrency(summary.revenue)}</strong></span>
                    <span><span className="block text-[0.5625rem] font-bold tracking-wide text-muted-foreground uppercase">Orders</span><strong className="mt-1 block text-xs text-foreground tabular-nums">{summary.orders.toLocaleString("en-IN")}</strong></span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {outlets.length === 1 ? <p className="mt-4 text-center text-xs text-muted-foreground">Single-location restaurant · the main branch is the complete network.</p> : null}
      </div>
    </section>
  );
}
