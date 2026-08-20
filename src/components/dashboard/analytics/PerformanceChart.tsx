"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChartSpline } from "lucide-react";

import type { AnalyticsMetric, AnalyticsPoint } from "@/data/analytics";
import { cn } from "@/lib/utils/cn";

const WIDTH = 920;
const HEIGHT = 310;
const PADDING = { top: 18, right: 80, bottom: 34, left: 18 };

interface PlotPoint {
  x: number;
  y: number;
  value: number;
}

const metricOptions: { id: AnalyticsMetric; label: string }[] = [
  { id: "revenue", label: "Revenue" },
  { id: "customers", label: "Customers" },
  { id: "restaurants", label: "Restaurants" },
];

function formatRevenue(value: number): string {
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)}L`;
  return `₹${Math.round(value / 1_000)}K`;
}

function formatCount(value: number): string {
  if (value >= 100_000) return `${(value / 100_000).toFixed(2)}L`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)}K`;
  return Math.round(value).toLocaleString("en-IN");
}

function formatMetric(value: number, metric: AnalyticsMetric): string {
  return metric === "revenue" ? formatRevenue(value) : formatCount(value);
}

function metricValue(point: AnalyticsPoint, metric: AnalyticsMetric): number {
  return point[metric];
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

export function PerformanceChart({
  data,
  metric,
  onMetricChange,
  periodLabel,
}: {
  data: AnalyticsPoint[];
  metric: AnalyticsMetric;
  onMetricChange: (metric: AnalyticsMetric) => void;
  periodLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);

  const chart = useMemo(() => {
    const currentValues = data.map((point) => metricValue(point, metric));
    const previousValues = data.map((point) =>
      metric === "revenue" ? point.previousRevenue : metricValue(point, metric) * 0.92,
    );
    const rawMin = Math.min(...currentValues, ...previousValues);
    const rawMax = Math.max(...currentValues, ...previousValues);
    const breathingRoom = Math.max((rawMax - rawMin) * 0.16, rawMax * 0.025);
    const min = Math.max(0, rawMin - breathingRoom);
    const max = rawMax + breathingRoom;

    return {
      min,
      max,
      current: makePoints(currentValues, min, max),
      previous: makePoints(previousValues, min, max),
      currentValues,
      previousValues,
    };
  }, [data, metric]);

  const safeIndex = Math.min(activeIndex, data.length - 1);
  const activePoint = data[safeIndex];
  const activePlotPoint = chart.current[safeIndex];
  const latest = chart.currentValues.at(-1) ?? 0;
  const comparison = chart.previousValues.at(-1) ?? 0;
  const delta = comparison ? ((latest - comparison) / comparison) * 100 : 0;
  const gridValues = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3;
    return chart.max - (chart.max - chart.min) * ratio;
  });

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    setActiveIndex(Math.round(progress * (data.length - 1)));
  }

  return (
    <section
      aria-labelledby="performance-chart-title"
      className="relative isolate overflow-hidden rounded-panel bg-ink p-5 text-ink-foreground shadow-lift sm:p-6 lg:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_90%_at_80%_0%,rgb(var(--primary-rgb)/0.24),transparent_68%)]"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
            <ChartSpline className="size-4 text-[var(--accent)]" aria-hidden="true" />
            Network performance
          </div>
          <h2 id="performance-chart-title" className="mt-2 text-xl font-extrabold">
            Growth index
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{periodLabel} · compared with prior period</p>
        </div>

        <div className="flex w-fit rounded-pill border border-white/10 bg-white/5 p-1" aria-label="Chart metric">
          {metricOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onMetricChange(option.id)}
              aria-pressed={metric === option.id}
              className={cn(
                "rounded-pill px-3 py-2 text-xs font-semibold transition-colors sm:px-4",
                metric === option.id
                  ? "bg-white text-ink shadow-soft"
                  : "text-ink-muted hover:text-ink-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <motion.p
          key={`${metric}-${latest}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-4xl"
        >
          {formatMetric(latest, metric)}
        </motion.p>
        <p className="mb-1 inline-flex items-center gap-1 rounded-pill bg-success/15 px-2.5 py-1 text-xs font-bold text-[#7ee2a8]">
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          {delta.toFixed(1)}%
        </p>
      </div>

      <div className="relative mt-5 min-h-[15rem]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="chart-svg-title chart-svg-description"
          className="h-auto w-full touch-none overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(data.length - 1)}
        >
          <title id="chart-svg-title">{metricOptions.find((item) => item.id === metric)?.label} trend</title>
          <desc id="chart-svg-description">
            {formatMetric(chart.currentValues[0], metric)} at {data[0].label}, rising to {formatMetric(latest, metric)} at {data.at(-1)?.label}.
          </desc>

          <defs>
            <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.36" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="analytics-glow" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {gridValues.map((value, index) => {
            const y = PADDING.top + (index / 3) * (HEIGHT - PADDING.top - PADDING.bottom);
            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3 8"
                />
                <text
                  x={WIDTH - PADDING.right + 12}
                  y={y + 4}
                  fill="rgba(238,240,247,0.5)"
                  fontSize="11"
                >
                  {formatMetric(value, metric)}
                </text>
              </g>
            );
          })}

          <motion.path
            key={`previous-${metric}-${periodLabel}`}
            d={linePath(chart.previous)}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.path
            key={`area-${metric}-${periodLabel}`}
            d={areaPath(chart.current)}
            fill="url(#analytics-area)"
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
            filter="url(#analytics-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {activePlotPoint ? (
            <g aria-hidden="true">
              <line
                x1={activePlotPoint.x}
                x2={activePlotPoint.x}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="rgba(255,255,255,0.22)"
                strokeDasharray="3 5"
              />
              <circle cx={activePlotPoint.x} cy={activePlotPoint.y} r="8" fill="rgba(147,167,224,0.18)" />
              <circle cx={activePlotPoint.x} cy={activePlotPoint.y} r="4" fill="var(--accent)" />
            </g>
          ) : null}

          {data.map((point, index) => {
            const plotPoint = chart.current[index];
            const step = Math.max(1, Math.ceil(data.length / 5));
            if (index % step !== 0 && index !== data.length - 1) return null;
            return (
              <text
                key={point.label}
                x={plotPoint.x}
                y={HEIGHT - 8}
                textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
                fill="rgba(238,240,247,0.48)"
                fontSize="11"
              >
                {point.label}
              </text>
            );
          })}
        </svg>

        {activePoint && activePlotPoint ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-10 min-w-[9rem] rounded-control border border-white/10 bg-[#20263a]/95 px-3 py-2.5 shadow-lift backdrop-blur-sm",
              activePlotPoint.x / WIDTH > 0.72 ? "-translate-x-full" : "translate-x-3",
            )}
            style={{
              left: `${(activePlotPoint.x / WIDTH) * 100}%`,
              top: `${Math.max((activePlotPoint.y / HEIGHT) * 100 - 14, 4)}%`,
            }}
          >
            <p className="text-[0.625rem] font-bold tracking-wider text-ink-muted uppercase">
              {activePoint.label}
            </p>
            <p className="mt-1 text-sm font-bold text-ink-foreground tabular-nums">
              {formatMetric(metricValue(activePoint, metric), metric)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.6875rem] font-semibold text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-[var(--accent)]" aria-hidden="true" /> Current period
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-5 border-t border-dashed border-white/35" aria-hidden="true" /> Previous period
        </span>
      </div>

      <table className="sr-only">
        <caption>{periodLabel} {metric} trend data</caption>
        <thead>
          <tr><th scope="col">Date</th><th scope="col">Value</th></tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{formatMetric(metricValue(point, metric), metric)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
