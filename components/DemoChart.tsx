"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 10 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 17 },
  { name: "Sat", value: 25 },
  { name: "Sun", value: 20 }
];

export default function DemoChart({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-sm mb-3 opacity-70">{title}</h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
