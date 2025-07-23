"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ProgressChartsProps {
  conservationData: { year: string; value: number }[];
  conservationActive: number;
  socioEconomicData: { year: string; value: number }[];
  socioEconomicActive: number;
}

export default function ProgressCharts({
  conservationData,
  conservationActive,
  socioEconomicData,
  socioEconomicActive,
}: ProgressChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="mb-2 text-gray-700">Conservation Progress</div>
        <div className="text-4xl font-bold mb-1">75%</div>
        <div className="text-sm text-gray-600 mb-4">
          Current Year{" "}
          <span className="text-[#54D12B] font-semibold">+10%</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conservationData} barCategoryGap={20}>
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
              />
              <YAxis hide />
              <Tooltip cursor={{ fill: "#f3fdf0" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {conservationData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={idx === conservationActive ? "#54D12B" : "#E5EDE5"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-6">
        <div className="mb-2 text-gray-700">Socio-Economic Progress</div>
        <div className="text-4xl font-bold mb-1">60%</div>
        <div className="text-sm text-gray-600 mb-4">
          Current Year <span className="text-[#54D12B] font-semibold">+5%</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={socioEconomicData} barCategoryGap={20}>
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
              />
              <YAxis hide />
              <Tooltip cursor={{ fill: "#f3fdf0" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {socioEconomicData.map((entry, idx) => (
                  <Cell
                    key={`cell-se-${idx}`}
                    fill={idx === socioEconomicActive ? "#54D12B" : "#E5EDE5"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
