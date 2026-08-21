"use client";

import { useMemo, useState } from "react";
import { Award, Drumstick, Egg, Leaf, Search, UtensilsCrossed } from "lucide-react";

import type { RestaurantMenuItem } from "@/data/dashboard-restaurant-details";
import { cn } from "@/lib/utils/cn";

type DietFilter = "all" | "veg" | "non-veg" | "egg";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dietMeta = {
  veg: { label: "Veg", icon: Leaf, className: "bg-success-soft text-success" },
  "non-veg": { label: "Non-veg", icon: Drumstick, className: "bg-danger-soft text-danger" },
  egg: { label: "Egg", icon: Egg, className: "bg-warning-soft text-warning" },
} as const;

function DietBadge({ diet }: { diet: RestaurantMenuItem["diet"] }) {
  const meta = dietMeta[diet];
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", meta.className)}>
      <Icon className="size-3" aria-hidden="true" /> {meta.label}
    </span>
  );
}

export function MenuPerformance({ items, outletLabel }: { items: RestaurantMenuItem[]; outletLabel: string }) {
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState<DietFilter>("all");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))].sort(), [items]);
  const activeCategory = category === "all" || categories.includes(category) ? category : "all";
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter((item) =>
        (!query || `${item.name} ${item.category}`.toLowerCase().includes(query)) &&
        (diet === "all" || item.diet === diet) &&
        (activeCategory === "all" || item.category === activeCategory),
      )
      .sort((a, b) => b.orders - a.orders);
  }, [activeCategory, diet, items, search]);

  return (
    <section aria-labelledby="menu-performance-title" className="overflow-hidden rounded-panel border border-border bg-card shadow-card">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 lg:flex-row lg:items-end lg:justify-between sm:px-6">
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Menu intelligence</p>
          <h2 id="menu-performance-title" className="mt-1.5 text-lg font-extrabold text-foreground">Menu items & pricing</h2>
          <p className="mt-1 text-xs text-muted-foreground">Item sales and availability for {outletLabel.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-2 rounded-control bg-primary-soft px-3 py-2 text-xs font-bold text-primary-strong">
          <UtensilsCrossed className="size-4" aria-hidden="true" /> {items.length} menu items
        </div>
      </div>

      <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-[minmax(15rem,1fr)_auto_minmax(10rem,0.4fr)] lg:items-end sm:p-5">
        <label className="sm:col-span-2 lg:col-span-1">
          <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Search menu</span>
          <span className="relative block">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search item or category"
              className="h-11 w-full rounded-control border border-border bg-card pr-3 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </span>
        </label>

        <fieldset>
          <legend className="mb-1.5 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Diet</legend>
          <div className="flex h-11 rounded-control bg-muted p-1">
            {(["all", "veg", "non-veg", "egg"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDiet(value)}
                aria-pressed={diet === value}
                className={cn(
                  "rounded-[0.55rem] px-3 text-xs font-bold transition-colors",
                  diet === value ? "bg-card text-primary-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "all" ? "All" : value === "veg" ? "Veg" : value === "egg" ? "Egg" : "Non-veg"}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Category</span>
          <select
            value={activeCategory}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">Showing {filteredItems.length} of {items.length} menu items.</p>

      {filteredItems.length ? (
        <>
          <div className="grid gap-3 p-4 xl:hidden">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-card border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-foreground">{item.name}</h3>
                      {item.bestseller ? <span className="inline-flex items-center gap-1 rounded-pill bg-star/15 px-2 py-0.5 text-[0.5625rem] font-bold text-warning"><Award className="size-3" aria-hidden="true" /> Bestseller</span> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <strong className="text-sm font-extrabold text-foreground tabular-nums">{priceFormatter.format(item.price)}</strong>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2"><DietBadge diet={item.diet} /><span className={cn("rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", item.available ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>{item.available ? "Available" : "Paused"}</span></div>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div><dt className="text-[0.5625rem] font-bold tracking-wide text-muted-foreground uppercase">Orders</dt><dd className="mt-1 text-sm font-bold text-foreground tabular-nums">{item.orders.toLocaleString("en-IN")}</dd></div>
                  <div><dt className="text-[0.5625rem] font-bold tracking-wide text-muted-foreground uppercase">Item revenue</dt><dd className="mt-1 text-sm font-bold text-foreground tabular-nums">{priceFormatter.format(item.revenue)}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div
            role="region"
            aria-label="Menu performance table. Scroll horizontally to see every column."
            tabIndex={0}
            className="hidden overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary xl:block"
          >
            <table className="w-full min-w-[56rem] table-fixed border-collapse text-left">
              <caption className="sr-only">Menu items with category, diet, price, orders, revenue and availability</caption>
              <colgroup><col className="w-[30%]" /><col className="w-[13%]" /><col className="w-[12%]" /><col className="w-[13%]" /><col className="w-[17%]" /><col className="w-[15%]" /></colgroup>
              <thead><tr className="bg-muted/55 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase"><th scope="col" className="px-6 py-3.5">Item</th><th scope="col" className="px-3 py-3.5">Diet</th><th scope="col" className="px-3 py-3.5">Price</th><th scope="col" className="px-3 py-3.5">Orders</th><th scope="col" className="px-3 py-3.5">Item revenue</th><th scope="col" className="px-3 py-3.5 pr-6">Availability</th></tr></thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-border/80 transition-colors hover:bg-primary-soft/35">
                    <th scope="row" className="px-6 py-4 font-normal"><div className="flex items-center gap-2"><span><span className="block text-sm font-extrabold text-foreground">{item.name}</span><span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{item.category}</span></span>{item.bestseller ? <span title="Bestseller" className="grid size-6 shrink-0 place-items-center rounded-full bg-star/15 text-warning"><Award className="size-3.5" aria-hidden="true" /></span> : null}</div></th>
                    <td className="px-3 py-4"><DietBadge diet={item.diet} /></td>
                    <td className="px-3 py-4 text-sm font-bold text-foreground tabular-nums">{priceFormatter.format(item.price)}</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground tabular-nums">{item.orders.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-4 text-sm font-bold text-foreground tabular-nums">{priceFormatter.format(item.revenue)}</td>
                    <td className="px-3 py-4 pr-6"><span className={cn("inline-flex rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", item.available ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>{item.available ? "Available" : "Paused"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid min-h-56 place-items-center px-6 text-center"><div><UtensilsCrossed className="mx-auto size-7 text-muted-foreground/50" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-foreground">No menu items match</p><button type="button" onClick={() => { setSearch(""); setDiet("all"); setCategory("all"); }} className="mt-3 text-xs font-bold text-primary-strong hover:underline">Reset menu filters</button></div></div>
      )}
    </section>
  );
}
