"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, ChartSpline } from "lucide-react";

import type { DetailMetric, RestaurantTrendPoint } from "@/data/dashboard-restaurant-details";
import { cn } from "@/lib/utils/cn";

const DEFAULT_WIDTH = 920;
const DEFAULT_HEIGHT = 310;

interface PlotPoint {
  x: number;
  y: number;
  value: number;
}

interface PlotPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const metricOptions: { id: DetailMetric; label: string }[] = [
  { id: "revenue", label: "Revenue" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Visits" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCompact(value: number): string {
  if (value >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)}K`;
  return Math.round(value).toLocaleString("en-IN");
}

function formatMetric(value: number, metric: DetailMetric): string {
  return metric === "revenue" ? `₹${formatCompact(value)}` : formatCompact(value);
}

function currentValue(point: RestaurantTrendPoint, metric: DetailMetric): number {
  if (metric === "revenue") return point.revenue;
  if (metric === "orders") return point.completedOrders;
  return point.customerVisits;
}

function previousValue(point: RestaurantTrendPoint, metric: DetailMetric): number {
  if (metric === "revenue") return point.previousRevenue;
  if (metric === "orders") return point.previousCompletedOrders;
  return point.previousCustomerVisits;
}

function makePoints(
  values: number[],
  min: number,
  max: number,
  width: number,
  height: number,
  padding: PlotPadding,
): PlotPoint[] {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const span = max - min || 1;
  return values.map((value, index) => ({
    x: padding.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: padding.top + ((max - value) / span) * plotHeight,
    value,
  }));
}

function linePath(points: PlotPoint[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
}

function areaPath(points: PlotPoint[], height: number, padding: PlotPadding): string {
  if (!points.length) return "";
  const baseline = height - padding.bottom;
  return `${linePath(points)} L${points.at(-1)?.x},${baseline} L${points[0].x},${baseline} Z`;
}

export function RestaurantPerformanceChart({
  data,
  metric,
  onMetricChange,
  periodLabel,
}: {
  data: RestaurantTrendPoint[];
  metric: DetailMetric;
  onMetricChange: (metric: DetailMetric) => void;
  periodLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const showYAxisLabels = dimensions.width >= 520;
  const padding = useMemo<PlotPadding>(() => ({
    top: 20,
    right: showYAxisLabels ? 82 : 10,
    bottom: 34,
    left: showYAxisLabels ? 18 : 8,
  }), [showYAxisLabels]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const updateDimensions = () => {
      const width = Math.max(1, Math.round(container.clientWidth));
      const height = Math.max(1, Math.round(container.clientHeight));
      setDimensions((current) => current.width === width && current.height === height ? current : { width, height });
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const chart = useMemo(() => {
    const current = data.map((point) => currentValue(point, metric));
    const previous = data.map((point) => previousValue(point, metric));
    const rawMax = Math.max(1, ...current, ...previous);
    const rawMin = Math.min(...current, ...previous, 0);
    const breathingRoom = Math.max((rawMax - rawMin) * 0.12, rawMax * 0.035);
    const min = Math.max(0, rawMin - breathingRoom);
    const max = rawMax + breathingRoom;
    return {
      min,
      max,
      current: makePoints(current, min, max, dimensions.width, dimensions.height, padding),
      previous: makePoints(previous, min, max, dimensions.width, dimensions.height, padding),
      currentValues: current,
      previousValues: previous,
    };
  }, [data, dimensions.height, dimensions.width, metric, padding]);

  const safeIndex = Math.max(0, Math.min(activeIndex, data.length - 1));
  const activePoint = data[safeIndex];
  const activePlotPoint = chart.current[safeIndex];
  const total = chart.currentValues.reduce((sum, value) => sum + value, 0);
  const previousTotal = chart.previousValues.reduce((sum, value) => sum + value, 0);
  const delta = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : 0;
  const hasActivity = total > 0;
  const gridValues = Array.from({ length: 4 }, (_, index) =>
    chart.max - (chart.max - chart.min) * (index / 3),
  );

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    setActiveIndex(Math.round(progress * Math.max(data.length - 1, 0)));
  }

  return (
    <section
      aria-labelledby="restaurant-performance-title"
      className="relative isolate overflow-hidden rounded-panel bg-ink p-5 text-ink-foreground shadow-lift sm:p-6 lg:p-7"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_90%_at_80%_0%,rgb(var(--primary-rgb)/0.28),transparent_68%)]" />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
            <ChartSpline className="size-4 text-[var(--accent)]" aria-hidden="true" /> Performance pulse
          </div>
          <h2 id="restaurant-performance-title" className="mt-2 text-xl font-extrabold">Revenue & demand trend</h2>
          <p className="mt-1 text-sm text-ink-muted">{periodLabel} · compared with the prior period</p>
        </div>

        <div className="flex w-fit max-w-full overflow-x-auto rounded-pill border border-white/10 bg-white/5 p-1" role="group" aria-label="Chart metric">
          {metricOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onMetricChange(option.id)}
              aria-pressed={metric === option.id}
              className={cn(
                "shrink-0 rounded-pill px-3 py-2 text-xs font-semibold transition-colors sm:px-4",
                metric === option.id ? "bg-white text-ink shadow-soft" : "text-ink-muted hover:text-ink-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <motion.p
          key={`${metric}-${total}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-4xl"
        >
          {formatMetric(total, metric)}
        </motion.p>
        {hasActivity ? (
          <p className={cn(
            "mb-1 inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold",
            delta >= 0 ? "bg-success/15 text-[#7ee2a8]" : "bg-danger/15 text-danger-soft",
          )}>
            {delta >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
            {Math.abs(delta).toFixed(1)}%
          </p>
        ) : null}
      </div>

      <div ref={chartContainerRef} className="relative mt-5 h-[15rem] sm:h-[17rem] lg:h-[19.375rem]">
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          role="img"
          aria-labelledby="restaurant-chart-svg-title restaurant-chart-svg-description"
          className="h-full w-full touch-pan-y overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(data.length - 1)}
        >
          <title id="restaurant-chart-svg-title">{metricOptions.find((item) => item.id === metric)?.label} trend</title>
          <desc id="restaurant-chart-svg-description">
            {hasActivity
              ? `${formatMetric(chart.currentValues[0], metric)} at ${data[0]?.fullLabel}, ending at ${formatMetric(chart.currentValues.at(-1) ?? 0, metric)}.`
              : "No completed transaction activity is available for the selected scope."}
          </desc>
          <defs>
            <linearGradient id="restaurant-detail-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="restaurant-detail-glow" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {gridValues.map((value, index) => {
            const y = padding.top + (index / 3) * (dimensions.height - padding.top - padding.bottom);
            return (
              <g key={`${value}-${index}`}>
                <line x1={padding.left} x2={dimensions.width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 8" />
                {showYAxisLabels ? <text x={dimensions.width - padding.right + 12} y={y + 4} fill="rgba(238,240,247,0.5)" fontSize="11">{formatMetric(value, metric)}</text> : null}
              </g>
            );
          })}

          <motion.path key={`previous-${metric}-${periodLabel}`} d={linePath(chart.previous)} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="6 8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <motion.path key={`area-${metric}-${periodLabel}`} d={areaPath(chart.current, dimensions.height, padding)} fill="url(#restaurant-detail-area)" initial={{ opacity: 0 }} animate={{ opacity: hasActivity ? 1 : 0.2 }} transition={{ duration: 0.45 }} />
          <motion.path key={`line-${metric}-${periodLabel}`} d={linePath(chart.current)} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#restaurant-detail-glow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: hasActivity ? 1 : 0.35 }} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }} />

          {activePlotPoint && hasActivity ? (
            <g aria-hidden="true">
              <line x1={activePlotPoint.x} x2={activePlotPoint.x} y1={padding.top} y2={dimensions.height - padding.bottom} stroke="rgba(255,255,255,0.22)" strokeDasharray="3 5" />
              <circle cx={activePlotPoint.x} cy={activePlotPoint.y} r="8" fill="rgba(147,167,224,0.18)" />
              <circle cx={activePlotPoint.x} cy={activePlotPoint.y} r="4" fill="var(--accent)" />
            </g>
          ) : null}

          {data.map((point, index) => {
            const plotPoint = chart.current[index];
            const step = Math.max(1, Math.ceil(data.length / (dimensions.width < 520 ? 3 : 5)));
            if (index % step !== 0 && index !== data.length - 1) return null;
            return (
              <text key={point.id} x={plotPoint.x} y={dimensions.height - 8} textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"} fill="rgba(238,240,247,0.48)" fontSize="11">
                {point.label}
              </text>
            );
          })}
        </svg>

        {!hasActivity ? (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div className="rounded-card border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm">
              <p className="text-sm font-bold">No transaction activity yet</p>
              <p className="mt-1 text-xs text-ink-muted">Complete onboarding to start collecting performance data.</p>
            </div>
          </div>
        ) : activePoint && activePlotPoint ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-10 min-w-[10rem] rounded-control border border-white/10 bg-[#20263a]/95 px-3 py-2.5 shadow-lift backdrop-blur-sm",
              activePlotPoint.x / dimensions.width > 0.7 ? "-translate-x-full" : "translate-x-3",
            )}
            style={{ left: `${(activePlotPoint.x / dimensions.width) * 100}%`, top: `${Math.max((activePlotPoint.y / dimensions.height) * 100 - 14, 4)}%` }}
          >
            <p className="text-[0.625rem] font-bold tracking-wider text-ink-muted uppercase">{activePoint.fullLabel}</p>
            <p className="mt-1 text-sm font-bold tabular-nums">{formatMetric(currentValue(activePoint, metric), metric)}</p>
            <p className="mt-1 text-[0.625rem] text-ink-muted tabular-nums">{currencyFormatter.format(activePoint.revenue)} · {activePoint.completedOrders} orders · {activePoint.customerVisits} visits</p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.6875rem] font-semibold text-ink-muted">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded-full bg-[var(--accent)]" aria-hidden="true" /> Current period</span>
        <span className="inline-flex items-center gap-2"><span className="w-5 border-t border-dashed border-white/35" aria-hidden="true" /> Previous period</span>
      </div>

      <table className="sr-only">
        <caption>{periodLabel} restaurant performance data</caption>
        <thead><tr><th scope="col">Period</th><th scope="col">Revenue</th><th scope="col">Completed orders</th><th scope="col">Cancelled orders</th><th scope="col">Customer visits</th></tr></thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.id}><th scope="row">{point.fullLabel}</th><td>{currencyFormatter.format(point.revenue)}</td><td>{point.completedOrders}</td><td>{point.cancelledOrders}</td><td>{point.customerVisits}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
