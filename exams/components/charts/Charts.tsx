"use client";

import { percent } from "@/lib/utils";

/** Horizontal accuracy bar, used for subject and topic breakdowns. */
export function AccuracyBar({
  label,
  correct,
  total,
  sublabel,
}: {
  label: string;
  correct: number;
  total: number;
  sublabel?: string;
}) {
  const value = percent(correct, total);
  const tone = value >= 70 ? "#2E7D5B" : value >= 40 ? "#C5A572" : "#B3261E";

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-dark">{label}</span>
        <span className="text-dark-400">
          {correct} of {total}
          {sublabel ? ` ${sublabel}` : ""} ({value}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-dark-50">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: tone }}
        />
      </div>
    </div>
  );
}

/** Score distribution histogram drawn as inline SVG, no chart dependency. */
export function ScoreDistribution({
  scores,
  maxScore,
  buckets = 10,
}: {
  scores: number[];
  maxScore: number;
  buckets?: number;
}) {
  if (scores.length === 0 || maxScore <= 0) {
    return <p className="text-sm text-dark-400">No submitted attempts yet.</p>;
  }

  const width = 640;
  const height = 220;
  const padLeft = 36;
  const padBottom = 28;
  const padTop = 12;

  const counts = new Array<number>(buckets).fill(0);
  for (const score of scores) {
    const ratio = Math.min(0.999, Math.max(0, score / maxScore));
    counts[Math.floor(ratio * buckets)] += 1;
  }
  const peak = Math.max(...counts, 1);
  const barWidth = (width - padLeft - 8) / buckets;
  const plotHeight = height - padBottom - padTop;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Score distribution"
    >
      {[0, 0.5, 1].map((tick) => {
        const y = padTop + plotHeight - tick * plotHeight;
        return (
          <g key={tick}>
            <line x1={padLeft} y1={y} x2={width - 4} y2={y} stroke="#E5E5E5" strokeWidth={1} />
            <text x={4} y={y + 4} fontSize={10} fill="#6E6E6E">
              {Math.round(tick * peak)}
            </text>
          </g>
        );
      })}
      {counts.map((count, index) => {
        const barHeight = (count / peak) * plotHeight;
        const x = padLeft + index * barWidth + 3;
        const y = padTop + plotHeight - barHeight;
        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={Math.max(2, barWidth - 6)}
              height={Math.max(count > 0 ? 2 : 0, barHeight)}
              fill="#C5A572"
              rx={2}
            />
            {count > 0 ? (
              <text
                x={x + (barWidth - 6) / 2}
                y={y - 4}
                fontSize={10}
                fill="#1A1A1A"
                textAnchor="middle"
              >
                {count}
              </text>
            ) : null}
          </g>
        );
      })}
      {counts.map((_, index) =>
        index % 2 === 0 ? (
          <text
            key={`label-${index}`}
            x={padLeft + index * barWidth + (barWidth - 6) / 2 + 3}
            y={height - 8}
            fontSize={10}
            fill="#6E6E6E"
            textAnchor="middle"
          >
            {Math.round((index / buckets) * 100)}%
          </text>
        ) : null
      )}
    </svg>
  );
}

/**
 * Score percentage plotted over time. A visible trend is what tells a student
 * whether revision is working, so this reads left to right oldest to newest.
 * Inline SVG, no chart dependency.
 */
export function ScoreTrend({
  points,
}: {
  points: Array<{ label: string; percent: number }>;
}) {
  if (points.length < 2) {
    return (
      <p className="text-sm text-dark-400">
        Two graded attempts are needed before a trend can be drawn.
      </p>
    );
  }

  const width = 640;
  const height = 200;
  const padLeft = 32;
  const padRight = 10;
  const padTop = 12;
  const padBottom = 26;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const x = (index: number): number =>
    padLeft + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const y = (value: number): number =>
    padTop + plotHeight - (Math.min(100, Math.max(0, value)) / 100) * plotHeight;

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.percent)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Score trend over time"
    >
      {[0, 50, 100].map((tick) => (
        <g key={tick}>
          <line
            x1={padLeft}
            y1={y(tick)}
            x2={width - padRight}
            y2={y(tick)}
            stroke="#E5E5E5"
            strokeWidth={1}
          />
          <text x={2} y={y(tick) + 4} fontSize={10} fill="#6E6E6E">
            {tick}
          </text>
        </g>
      ))}

      <path d={line} fill="none" stroke="#C5A572" strokeWidth={2} />

      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle cx={x(index)} cy={y(point.percent)} r={3.5} fill="#1A1A1A" />
          <title>{`${point.label}: ${point.percent}%`}</title>
        </g>
      ))}

      <text x={padLeft} y={height - 6} fontSize={10} fill="#6E6E6E">
        {points[0].label}
      </text>
      <text
        x={width - padRight}
        y={height - 6}
        fontSize={10}
        fill="#6E6E6E"
        textAnchor="end"
      >
        {points[points.length - 1].label}
      </text>
    </svg>
  );
}

/** Compact vertical bars for question counts by subject. */
export function SubjectBars({
  items,
}: {
  items: Array<{ label: string; value: number }>;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-dark-400">No subjects yet.</p>;
  }
  const peak = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm text-dark">{item.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-dark-50">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${(item.value / peak) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm text-dark-400">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
