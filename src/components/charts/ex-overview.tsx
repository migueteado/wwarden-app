"use client";

import { Category, Subcategory } from "@prisma/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ExOverviewProps {
  data: { name: string; [subcategory: string]: number | string }[];
  categories: Category[];
}

export function ExOverview({ data, categories }: ExOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {categories.map((category) => (
          <Bar
            key={category.name}
            dataKey={category.name}
            stackId="a"
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
