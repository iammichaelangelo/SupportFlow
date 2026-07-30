"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartPoint = {
  day: string;
  tickets: number;
};

export function DashboardChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 12 }}>
          <defs>
            <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f7df3" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#4f7df3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#edf1f8" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e6ebf4",
              boxShadow: "0 12px 30px rgba(30,55,90,.12)",
            }}
          />
          <Area
            type="monotone"
            dataKey="tickets"
            stroke="#4f7df3"
            strokeWidth={3}
            fill="url(#fillTickets)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
