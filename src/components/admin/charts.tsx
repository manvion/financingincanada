"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#1d3c5e";
const GOLD = "#bf9d5e";

export function LeadsAreaChart({ data }: { data: { month: string; leads: number; contacts: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={NAVY} stopOpacity={0.35} />
            <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="contactsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GOLD} stopOpacity={0.35} />
            <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,130,150,0.15)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" opacity={0.6} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" opacity={0.6} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid rgba(120,130,150,0.2)", fontSize: 13 }}
          cursor={{ stroke: GOLD, strokeWidth: 1 }}
        />
        <Area type="monotone" dataKey="leads" name="Leads" stroke={NAVY} strokeWidth={2.5} fill="url(#leadsFill)" />
        <Area type="monotone" dataKey="contacts" name="Contacts" stroke={GOLD} strokeWidth={2.5} fill="url(#contactsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ViewsBarChart({ data }: { data: { title: string; views: number }[] }) {
  const chartData = data.map((d) => ({ name: d.title.length > 22 ? d.title.slice(0, 22) + "…" : d.title, views: d.views }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,130,150,0.15)" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" opacity={0.6} />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={11} width={140} stroke="currentColor" opacity={0.7} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(120,130,150,0.2)", fontSize: 13 }} cursor={{ fill: "rgba(201,162,75,0.08)" }} />
        <Bar dataKey="views" name="Views" radius={[0, 6, 6, 0]} barSize={18}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={i === 0 ? GOLD : NAVY} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
