import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type Series = { key: string; label: string; color: string; axis?: "left" | "right"; format?: (n: number) => string };

const shortDate = (d: string) => {
  const t = new Date(`${d}T00:00:00`);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** Area chart over dates, one or two axes, with soft gradient fills. */
export function TrendChart<T extends { date: string }>({ data, series, height = 240 }: { data: T[]; series: Series[]; height?: number }) {
  const id = useId().replace(/:/g, "");
  const right = series.some((s) => s.axis === "right");
  if (!data.length) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/30 font-body text-sm text-muted-foreground" style={{ height }}>
        No data for this period yet.
      </div>
    );
  }
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: right ? 0 : 8, bottom: 0, left: -12 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
          {right && (
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
          )}
          <Tooltip
            cursor={{ stroke: "hsl(var(--border))" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 10,
              fontSize: 12,
              boxShadow: "0 8px 24px -12px rgba(0,0,0,.25)",
            }}
            labelFormatter={(d) => shortDate(String(d))}
            formatter={(value: number, name: string) => {
              const s = series.find((x) => x.label === name);
              return [s?.format ? s.format(value) : value.toLocaleString("en-US"), name];
            }}
          />
          {series.map((s) => (
            <Area
              key={s.key}
              yAxisId={s.axis ?? "left"}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${id}-${s.key})`}
              animationDuration={900}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Legend({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => (
        <span key={s.key} className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}
