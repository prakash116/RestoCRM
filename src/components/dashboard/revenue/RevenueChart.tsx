"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, ChartSpline } from "lucide-react";

import type { RevenueMetric, RevenuePoint } from "@/data/revenue";
import { cn } from "@/lib/utils/cn";

const WIDTH = 920;
const HEIGHT = 320;
const PADDING = { top: 18, right: 82, bottom: 36, left: 18 };

interface PlotPoint {
  x: number;
  y: number;
  value: number;
}

const metrics: { id: RevenueMetric; label: string; shortLabel: string }[] = [
  { id: "grossRevenue", label: "Gross volume", shortLabel: "Gross" },
  { id: "netPayout", label: "Net payout", shortLabel: "Net" },
  { id: "pendingAmount", label: "Pending", shortLabel: "Pending" },
];

function formatMoney(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)}L`;
  return `₹${Math.round(value / 1_000)}K`;
}

function makePoints(values: number[], min: number, max: number): PlotPoint[] {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const span = max - min || 1;

  return values.map((value, index) => ({
    x: PADDING.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: PADDING.top + ((max - value) / span) * plotHeight,
    value,
  }));
}

function linePath(points: PlotPoint[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
}

function areaPath(points: PlotPoint[]): string {
  if (!points.length) return "";
  const baseline = HEIGHT - PADDING.bottom;
  return `${linePath(points)} L${points.at(-1)?.x},${baseline} L${points[0].x},${baseline} Z`;
}

export function RevenueChart({
  data,
  metric,
  onMetricChange,
  periodLabel,
}: {
  data: RevenuePoint[];
  metric: RevenueMetric;
  onMetricChange: (metric: RevenueMetric) => void;
  periodLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);

  const chart = useMemo(() => {
    const currentValues = data.map((point) => point[metric]);
    const previousValues = data.map((point) => {
      if (metric === "grossRevenue") return point.previousGross;
      const previousPending = Math.round(point.pendingAmount * 1.094);
      if (metric === "netPayout") {
        return (
          point.previousGross -
          Math.round(point.previousGross * 0.0152) -
          Math.round(point.previousGross * 0.0337) -
          previousPending
        );
      }
      return previousPending;
    });
    const rawMin = Math.min(...currentValues, ...previousValues);
    const rawMax = Math.max(...currentValues, ...previousValues);
    const breathingRoom = Math.max((rawMax - rawMin) * 0.14, rawMax * 0.025);
    const min = Math.max(0, rawMin - breathingRoom);
    const max = rawMax + breathingRoom;

    return {
      min,
      max,
      currentValues,
      previousValues,
      current: makePoints(currentValues, min, max),
      previous: makePoints(previousValues, min, max),
    };
  }, [data, metric]);

  const safeIndex = Math.min(activeIndex, data.length - 1);
  const activeData = data[safeIndex];
  const activePoint = chart.current[safeIndex];
  const latest = chart.currentValues.at(-1) ?? 0;
  const previous = chart.previousValues.at(-1) ?? 0;
  const delta = previous ? ((latest - previous) / previous) * 100 : 0;
  const favourable = metric === "pendingAmount" ? delta <= 0 : delta >= 0;
  const gridValues = Array.from({ length: 4 }, (_, index) =>
    chart.max - ((chart.max - chart.min) * index) / 3,
  );
  const maxOrders = Math.max(...data.map((point) => point.orders));

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    setActiveIndex(Math.round(progress * (data.length - 1)));
  }

  return (
    <section
      aria-labelledby="revenue-chart-title"
      className="relative isolate overflow-hidden rounded-panel bg-ink p-5 text-ink-foreground shadow-lift sm:p-6 lg:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(85%_100%_at_78%_0%,rgb(var(--primary-rgb)/0.28),transparent_65%)]"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
            <ChartSpline className="size-4 text-[var(--accent)]" aria-hidden="true" />
            Cash velocity
          </p>
          <h2 id="revenue-chart-title" className="mt-2 text-xl font-extrabold">Revenue flow</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {periodLabel} · {metric === "pendingAmount" ? "outstanding settlement balance" : "cumulative network value"}
          </p>
        </div>

        <div className="grid w-full grid-cols-3 rounded-pill border border-ink-foreground/10 bg-ink-foreground/5 p-1 sm:w-fit" role="group" aria-label="Revenue metric">
          {metrics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onMetricChange(item.id)}
              aria-pressed={metric === item.id}
              className={cn(
                "rounded-pill px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:px-4",
                metric === item.id
                  ? "bg-ink-foreground text-ink shadow-soft"
                  : "text-ink-muted hover:text-ink-foreground",
              )}
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <motion.p
          key={`${metric}-${latest}`}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-4xl"
        >
          {formatMoney(latest)}
        </motion.p>
        <p
          className={cn(
            "mb-1 inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold tabular-nums",
            favourable ? "bg-success/15 text-success-on-ink" : "bg-danger/15 text-danger-on-ink",
          )}
        >
          {delta >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
          {Math.abs(delta).toFixed(1)}%
        </p>
      </div>

      <div className="relative mt-5 h-56 sm:h-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="revenue-svg-title revenue-svg-description"
          className="h-full w-full touch-pan-y overflow-visible sm:h-auto"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(data.length - 1)}
        >
          <title id="revenue-svg-title">{metrics.find((item) => item.id === metric)?.label} trend</title>
          <desc id="revenue-svg-description">
            {formatMoney(chart.currentValues[0])} at {data[0].label}, changing to {formatMoney(latest)} at {data.at(-1)?.label}.
          </desc>
          <defs>
            <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="revenue-glow" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {gridValues.map((value, index) => {
            const y = PADDING.top + (index / 3) * (HEIGHT - PADDING.top - PADDING.bottom);
            return (
              <g key={value}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="var(--ink-foreground)" strokeOpacity="0.1" strokeDasharray="3 8" />
                <text className="max-sm:hidden" x={WIDTH - PADDING.right + 12} y={y + 4} fill="var(--ink-foreground)" fillOpacity="0.5" fontSize="11">{formatMoney(value)}</text>
              </g>
            );
          })}

          {data.map((point, index) => {
            const plotPoint = chart.current[index];
            const barHeight = Math.max(3, (point.orders / maxOrders) * 42);
            const barWidth = Math.min(
              32,
              Math.max(4, (WIDTH - PADDING.left - PADDING.right) / data.length - 8),
            );
            return (
              <rect
                key={`volume-${point.label}`}
                x={plotPoint.x - barWidth / 2}
                y={HEIGHT - PADDING.bottom - barHeight}
                width={barWidth}
                height={barHeight}
                rx="2"
                fill="var(--ink-foreground)"
                fillOpacity="0.055"
              />
            );
          })}

          <motion.path
            key={`previous-${metric}-${periodLabel}`}
            d={linePath(chart.previous)}
            fill="none"
            stroke="var(--ink-foreground)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.path
            key={`area-${metric}-${periodLabel}`}
            d={areaPath(chart.current)}
            fill="url(#revenue-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          />
          <motion.path
            key={`line-${metric}-${periodLabel}`}
            d={linePath(chart.current)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#revenue-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {activePoint ? (
            <g aria-hidden="true">
              <line x1={activePoint.x} x2={activePoint.x} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} stroke="var(--ink-foreground)" strokeOpacity="0.22" strokeDasharray="3 5" />
              <circle cx={activePoint.x} cy={activePoint.y} r="8" fill="var(--accent)" fillOpacity="0.18" />
              <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="var(--accent)" />
            </g>
          ) : null}

          {data.map((point, index) => {
            const plotPoint = chart.current[index];
            const step = Math.max(1, Math.ceil(data.length / 5));
            if (index % step !== 0 && index !== data.length - 1) return null;
            return (
              <text
                key={point.label}
                className="max-sm:hidden"
                x={plotPoint.x}
                y={HEIGHT - 9}
                textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
                fill="var(--ink-foreground)"
                fillOpacity="0.48"
                fontSize="11"
              >
                {point.label}
              </text>
            );
          })}
        </svg>

        {activeData && activePoint ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-10 hidden min-w-[10.5rem] rounded-control border border-ink-foreground/10 bg-ink/95 px-3 py-2.5 shadow-lift backdrop-blur-sm sm:block",
              activePoint.x / WIDTH > 0.72 ? "-translate-x-full" : "translate-x-3",
            )}
            style={{ left: `${(activePoint.x / WIDTH) * 100}%`, top: `${Math.max((activePoint.y / HEIGHT) * 100 - 14, 4)}%` }}
          >
            <p className="text-[0.625rem] font-bold tracking-wider text-ink-muted uppercase">{activeData.label}</p>
            <p className="mt-1 text-sm font-bold tabular-nums">{formatMoney(activeData[metric])}</p>
            <p className="mt-1 text-[0.625rem] text-ink-muted">{activeData.orders.toLocaleString("en-IN")} orders · {activeData.successRate.toFixed(2)}% success</p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.6875rem] font-semibold text-ink-muted">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded-full bg-[var(--accent)]" aria-hidden="true" />Current period</span>
        <span className="inline-flex items-center gap-2"><span className="w-5 border-t border-dashed border-ink-foreground/35" aria-hidden="true" />Previous period</span>
        <span className="inline-flex items-center gap-2"><span className="size-2 rounded-sm bg-ink-foreground/10" aria-hidden="true" />Order volume</span>
      </div>

      <table className="sr-only">
        <caption>{periodLabel} revenue trend data</caption>
        <thead><tr><th scope="col">Date</th><th scope="col">Value</th><th scope="col">Orders</th><th scope="col">Success rate</th></tr></thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}><th scope="row">{point.label}</th><td>{formatMoney(point[metric])}</td><td>{point.orders}</td><td>{point.successRate.toFixed(2)}%</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
