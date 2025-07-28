"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Users,
  TreePine,
  BarChart2,
  UserCheck,
  UserX,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const projectCategories = [
  {
    label: "Conservation",
    value: "conservation",
    icon: TreePine,
  },
  {
    label: "Socio-Economic",
    value: "socio-economic",
    icon: Users,
  },
];

type ProjectCategory = "conservation" | "socio-economic";

interface ProjectOption {
  label: string;
  value: string;
  description: string;
}

const projectOptions: Record<ProjectCategory, ProjectOption[]> = {
  conservation: [
    {
      label: "Tree Planting",
      value: "tree-planting",
      description: "Forest restoration and reforestation projects",
    },
    {
      label: "Bamboo Cultivation",
      value: "bamboo",
      description: "Sustainable bamboo farming and conservation",
    },
    {
      label: "Wildlife Protection",
      value: "wildlife",
      description: "Biodiversity conservation and habitat protection",
    },
    {
      label: "Soil Conservation",
      value: "soil",
      description: "Erosion control and soil health improvement",
    },
    {
      label: "Water Conservation",
      value: "water",
      description: "Watershed management and water resource protection",
    },
    {
      label: "Ecosystem Restoration",
      value: "ecosystem",
      description: "Habitat restoration and ecological balance",
    },
  ],
  "socio-economic": [
    {
      label: "Community Development",
      value: "community",
      description: "Local community empowerment programs",
    },
    {
      label: "Sustainable Agriculture",
      value: "agriculture",
      description: "Climate-smart farming practices",
    },
    {
      label: "Eco-Tourism",
      value: "tourism",
      description: "Sustainable tourism development",
    },
    {
      label: "Green Technology",
      value: "technology",
      description: "Clean technology adoption and training",
    },
    {
      label: "Microfinance",
      value: "microfinance",
      description: "Financial inclusion and support programs",
    },
    {
      label: "Education & Training",
      value: "education",
      description: "Environmental education and skill development",
    },
  ],
};

// Mock beneficiary data for different years
const beneficiaryDataByYear = {
  2022: {
    conservation: [
      { month: "Jan", beneficiaries: 800, target: 1500 },
      { month: "Feb", beneficiaries: 950, target: 1500 },
      { month: "Mar", beneficiaries: 1100, target: 1500 },
      { month: "Apr", beneficiaries: 1250, target: 1500 },
      { month: "May", beneficiaries: 1400, target: 1500 },
      { month: "Jun", beneficiaries: 1550, target: 1500 },
      { month: "Jul", beneficiaries: 1350, target: 1500 },
      { month: "Aug", beneficiaries: 1600, target: 1500 },
      { month: "Sep", beneficiaries: 1750, target: 1500 },
      { month: "Oct", beneficiaries: 1900, target: 1500 },
      { month: "Nov", beneficiaries: 2050, target: 1500 },
      { month: "Dec", beneficiaries: 2200, target: 1500 },
    ],
    socioEconomic: [
      { month: "Jan", beneficiaries: 500, target: 1000 },
      { month: "Feb", beneficiaries: 650, target: 1000 },
      { month: "Mar", beneficiaries: 800, target: 1000 },
      { month: "Apr", beneficiaries: 950, target: 1000 },
      { month: "May", beneficiaries: 1100, target: 1000 },
      { month: "Jun", beneficiaries: 1250, target: 1000 },
      { month: "Jul", beneficiaries: 1050, target: 1000 },
      { month: "Aug", beneficiaries: 1300, target: 1000 },
      { month: "Sep", beneficiaries: 1450, target: 1000 },
      { month: "Oct", beneficiaries: 1600, target: 1000 },
      { month: "Nov", beneficiaries: 1750, target: 1000 },
      { month: "Dec", beneficiaries: 1900, target: 1000 },
    ],
  },
  2023: {
    conservation: [
      { month: "Jan", beneficiaries: 1000, target: 1800 },
      { month: "Feb", beneficiaries: 1150, target: 1800 },
      { month: "Mar", beneficiaries: 1300, target: 1800 },
      { month: "Apr", beneficiaries: 1450, target: 1800 },
      { month: "May", beneficiaries: 1600, target: 1800 },
      { month: "Jun", beneficiaries: 1750, target: 1800 },
      { month: "Jul", beneficiaries: 1550, target: 1800 },
      { month: "Aug", beneficiaries: 1800, target: 1800 },
      { month: "Sep", beneficiaries: 1950, target: 1800 },
      { month: "Oct", beneficiaries: 2100, target: 1800 },
      { month: "Nov", beneficiaries: 2250, target: 1800 },
      { month: "Dec", beneficiaries: 2400, target: 1800 },
    ],
    socioEconomic: [
      { month: "Jan", beneficiaries: 700, target: 1200 },
      { month: "Feb", beneficiaries: 850, target: 1200 },
      { month: "Mar", beneficiaries: 1000, target: 1200 },
      { month: "Apr", beneficiaries: 1150, target: 1200 },
      { month: "May", beneficiaries: 1300, target: 1200 },
      { month: "Jun", beneficiaries: 1450, target: 1200 },
      { month: "Jul", beneficiaries: 1250, target: 1200 },
      { month: "Aug", beneficiaries: 1500, target: 1200 },
      { month: "Sep", beneficiaries: 1650, target: 1200 },
      { month: "Oct", beneficiaries: 1800, target: 1200 },
      { month: "Nov", beneficiaries: 1950, target: 1200 },
      { month: "Dec", beneficiaries: 2100, target: 1200 },
    ],
  },
  2024: {
    conservation: [
      { month: "Jan", beneficiaries: 1250, target: 2000 },
      { month: "Feb", beneficiaries: 1450, target: 2000 },
      { month: "Mar", beneficiaries: 1800, target: 2000 },
      { month: "Apr", beneficiaries: 1650, target: 2000 },
      { month: "May", beneficiaries: 1950, target: 2000 },
      { month: "Jun", beneficiaries: 2100, target: 2000 },
      { month: "Jul", beneficiaries: 1850, target: 2000 },
      { month: "Aug", beneficiaries: 2200, target: 2000 },
      { month: "Sep", beneficiaries: 2400, target: 2000 },
      { month: "Oct", beneficiaries: 2600, target: 2000 },
      { month: "Nov", beneficiaries: 2800, target: 2000 },
      { month: "Dec", beneficiaries: 3000, target: 2000 },
    ],
    socioEconomic: [
      { month: "Jan", beneficiaries: 800, target: 1500 },
      { month: "Feb", beneficiaries: 950, target: 1500 },
      { month: "Mar", beneficiaries: 1100, target: 1500 },
      { month: "Apr", beneficiaries: 1250, target: 1500 },
      { month: "May", beneficiaries: 1400, target: 1500 },
      { month: "Jun", beneficiaries: 1550, target: 1500 },
      { month: "Jul", beneficiaries: 1350, target: 1500 },
      { month: "Aug", beneficiaries: 1600, target: 1500 },
      { month: "Sep", beneficiaries: 1750, target: 1500 },
      { month: "Oct", beneficiaries: 1900, target: 1500 },
      { month: "Nov", beneficiaries: 2050, target: 1500 },
      { month: "Dec", beneficiaries: 2200, target: 1500 },
    ],
  },
};

// Generate years array (2020 to current year)
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2019 },
  (_, i) => 2020 + i
).reverse();

// Months array
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AnalyticsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | ""
  >("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const currentOptions: ProjectOption[] = selectedCategory
    ? projectOptions[selectedCategory as ProjectCategory]
    : [];

  const handleShowAnalytics = () => {
    setShowAnalytics(true);
  };

  // Get data for selected year and category
  const getBeneficiariesData = () => {
    const yearData =
      beneficiaryDataByYear[selectedYear as keyof typeof beneficiaryDataByYear];
    if (!yearData)
      return selectedCategory === "conservation"
        ? beneficiaryDataByYear[2024].conservation
        : beneficiaryDataByYear[2024].socioEconomic;

    return selectedCategory === "conservation"
      ? yearData.conservation
      : yearData.socioEconomic;
  };

  // Calculate total beneficiaries for the selected category and year
  const getTotalBeneficiaries = () => {
    const data = getBeneficiariesData();
    return data.reduce((sum, item) => sum + item.beneficiaries, 0);
  };

  // Calculate selected month beneficiaries
  const getSelectedMonthBeneficiaries = () => {
    const data = getBeneficiariesData();
    const monthData = data.find((item) => item.month === selectedMonth);
    return monthData?.beneficiaries || 0;
  };

  // Calculate target beneficiaries
  const getTargetBeneficiaries = () => {
    const data = getBeneficiariesData();
    return data[0]?.target || 0;
  };

  // Calculate current vs remaining data for pie chart
  const getCurrentVsRemainingData = () => {
    const selectedMonthBeneficiaries = getSelectedMonthBeneficiaries();
    const monthlyTarget = getTargetBeneficiaries();
    const remaining = Math.max(0, monthlyTarget - selectedMonthBeneficiaries);

    return [
      {
        name: "Current Beneficiaries",
        value: selectedMonthBeneficiaries,
        color: "#54D12B",
      },
      { name: "Remaining Target", value: remaining, color: "#EF4444" },
    ];
  };

  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <main className="ml-64 py-7 px-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <Link
            href="/dashboard/reports"
            className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold shadow-sm transition-colors hover:bg-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
        </div>

        {/* Analytics Selection Form */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
            Select Analytics
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Project Category
                </Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value as ProjectCategory);
                    setSelectedProject(""); // Reset project selection
                    setShowAnalytics(false); // Reset analytics display
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                >
                  <option value="">Select Category</option>
                  {projectCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Project Type
                </Label>
                <select
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    setShowAnalytics(false); // Reset analytics display
                  }}
                  disabled={!selectedCategory}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors disabled:opacity-50"
                >
                  <option value="">Select Project Type</option>
                  {currentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Year
                </Label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setShowAnalytics(false); // Reset analytics display
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Month
                </Label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setShowAnalytics(false); // Reset analytics display
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Show Analytics Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleShowAnalytics}
                className="bg-[#54D12B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#54D12B]/90 transition-colors disabled:opacity-50"
                disabled={
                  !selectedCategory || !selectedProject || !selectedMonth
                }
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Show Analytics
                </span>
              </Button>
            </div>
          </Card>
        </section>

        {/* Analytics Charts */}
        {showAnalytics && (
          <div className="space-y-8 mt-12">
            {/* Beneficiary Stats Cards */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Beneficiary Summary ({selectedYear})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">
                      Total Beneficiaries
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {getTotalBeneficiaries().toLocaleString()}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">{selectedYear}</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">
                      Selected Month
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {getSelectedMonthBeneficiaries().toLocaleString()}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedMonth} {selectedYear}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserX className="w-6 h-6 text-gray-500" />
                    <span className="text-gray-700 text-sm">Target</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {getTargetBeneficiaries().toLocaleString()}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">Monthly Target</p>
                </Card>
              </div>
            </section>

            {/* Charts */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Beneficiary Analytics for{" "}
                {
                  currentOptions.find((opt) => opt.value === selectedProject)
                    ?.label
                }{" "}
                ({selectedYear})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Monthly Beneficiaries ({selectedYear})
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getBeneficiariesData()}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="beneficiaries"
                          fill="#54D12B"
                          radius={[4, 4, 0, 0]}
                          name="Beneficiaries"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Current vs Remaining Beneficiaries ({selectedMonth}{" "}
                    {selectedYear})
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getCurrentVsRemainingData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${
                              percent ? (percent * 100).toFixed(0) : 0
                            }%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getCurrentVsRemainingData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
