"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/lib/auth-context";
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
      description: "Tree Planting",
    },
    {
      label: "Water Tanks",
      value: "water-tanks",
      description: "Water Tanks",
    },
    {
      label: "EU-Funded Project",
      value: "eu-funded-project",
      description: "EU-Funded Project",
    },
    {
      label: "Bamboo",
      value: "bamboo",
      description: "Bamboo",
    },
    {
      label: "Buffalo Wall",
      value: "buffalo-wall",
      description: "Buffalo Wall",
    },
  ],
  "socio-economic": [
    {
      label: "Livestock",
      value: "livestock",
      description: "Livestock",
    },
    {
      label: "Housing / Materials",
      value: "housing-materials",
      description: "Housing / Materials",
    },
    {
      label: "Housing / Toilets",
      value: "housing-toilets",
      description: "Housing / Toilets",
    },
    {
      label: "Housing / Villages",
      value: "housing-villages",
      description: "Housing / Villages",
    },
    {
      label: "Education / Materials",
      value: "education-materials",
      description: "Education / Materials",
    },
    {
      label: "Parking",
      value: "parking",
      description: "Parking",
    },
  ],
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

// Strong types for monthly analytics points
interface MonthlyDatum {
  month: string;
  beneficiaries: number;
  target?: number;
}

interface TotalsResponse {
  distributedAnimals?: number;
  born?: number;
  deaths?: number;
  soldAnimals?: number;
  transferredAnimals?: number;
  currentlyOwned?: number;
  targetBeneficiaries?: number;
  currentBeneficiaries?: number;
  distributedMaterials?: number;
  toiletsBuilt?: number;
  totalHouses?: number;
  goodCondition?: number;
  badCondition?: number;
  carsSupported?: number;
}

export default function AnalyticsPageContent() {
  const API_BASE =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
    "http://localhost:3000";
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | ""
  >("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [apiMonthlyData, setApiMonthlyData] = useState<
    Array<{ month: string | number; beneficiaries: number; target?: number }>
  >([]);
  const [apiTotals, setApiTotals] = useState<TotalsResponse | null>(null);
  const [apiTotalBeneficiaries, setApiTotalBeneficiaries] = useState<
    number | null
  >(null);
  const [apiPie, setApiPie] = useState<{
    current?: number;
    target?: number;
    remaining?: number;
    percentCurrent?: number;
    percentRemaining?: number;
    exceeded?: boolean;
  } | null>(null);
  const [apiPieAlt, setApiPieAlt] = useState<{
    slices: Array<{ label: string; value: number }>;
  } | null>(null);
  const [apiChartHints, setApiChartHints] = useState<{
    showPie?: boolean;
    showBar?: boolean;
  } | null>(null);

  const currentOptions: ProjectOption[] = selectedCategory
    ? projectOptions[selectedCategory as ProjectCategory]
    : [];

  const buildAnalyticsUrl = () => {
    if (!selectedCategory || !selectedProject || !selectedYear) return "";
    const params = new URLSearchParams();
    params.set("category", selectedCategory);
    params.set("project", selectedProject);
    params.set("year", String(selectedYear));
    if (selectedMonth) {
      const monthIndex = months.findIndex((m) => m === selectedMonth);
      if (monthIndex >= 0) params.set("month", String(monthIndex + 1));
    }
    return `${API_BASE}/api/analytics?${params.toString()}`;
  };

  const isBeneficiariesProject = (project: string) =>
    [
      "livestock",
      "housing-materials",
      "housing-toilets",
      "education-materials",
    ].includes(project);

  const isVillagesProject = (project: string) => project === "housing-villages";
  const isParkingProject = (project: string) => project === "parking";
  const isNoChartsProject = (project: string) =>
    project === "parking" || project === "bamboo" || project === "buffalo-wall";

  // Choose which numeric field to chart as beneficiaries, per socio-economic project
  const primaryMetricForProject = (project: string): string => {
    switch (project) {
      // Conservation
      case "bamboo":
        return "distanceCovered";
      case "tree-planting":
        return "currentBeneficiaries";
      case "water-tanks":
        return "currentBeneficiaries";
      case "eu-funded-project":
        return "currentBeneficiaries";
      case "buffalo-wall":
        return "cost";
      case "housing-materials":
        return "distributedMaterials";
      case "housing-toilets":
        return "toiletsBuilt";
      case "housing-villages":
        return "totalHouses";
      case "education-materials":
        return "distributedMaterials";
      case "parking":
        return "carsSupported";
      default:
        return "currentBeneficiaries"; // livestock and others
    }
  };

  // Metrics to summarize for socio-economic projects
  const summaryMetricsForProject = (
    project: string
  ): Array<{ key: keyof TotalsResponse; label: string }> => {
    switch (project) {
      // Conservation summaries
      case "tree-planting":
        return [
          { key: "numberOfTrees" as any, label: "Trees" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "water-tanks":
        return [
          { key: "numberOfTanks" as any, label: "Tanks" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "eu-funded-project":
        return [
          { key: "numberOfTrees" as any, label: "Trees" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "bamboo":
        return [{ key: "distanceCovered" as any, label: "Distance Covered" }];
      case "buffalo-wall":
        return [{ key: "cost" as any, label: "Cost" }];
      case "livestock":
        return [
          { key: "distributedAnimals", label: "Distributed Animals" },
          { key: "born", label: "Born" },
          { key: "deaths", label: "Deaths" },
          { key: "soldAnimals", label: "Sold Animals" },
          { key: "transferredAnimals", label: "Transferred" },
          { key: "currentlyOwned", label: "Currently Owned" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "housing-materials":
        return [
          { key: "distributedMaterials", label: "Distributed Materials" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "housing-toilets":
        return [
          { key: "toiletsBuilt", label: "Toilets Built" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "housing-villages":
        return [
          { key: "totalHouses", label: "Total Houses" },
          { key: "goodCondition", label: "Good Condition" },
          { key: "badCondition", label: "Bad Condition" },
        ];
      case "education-materials":
        return [
          { key: "distributedMaterials", label: "Distributed Materials" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
        ];
      case "parking":
        return [{ key: "carsSupported", label: "Cars Supported" }];
      default:
        return [
          { key: "currentBeneficiaries", label: "Current Beneficiaries" },
          { key: "targetBeneficiaries", label: "Target Beneficiaries" },
        ];
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const url = buildAnalyticsUrl();
      if (!url) return;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const payload = await res.json();
      setApiTotals(payload?.totals ?? payload?.data?.totals ?? null);
      setApiTotalBeneficiaries(
        payload?.totalBeneficiaries ?? payload?.data?.totalBeneficiaries ?? null
      );
      setApiPie(payload?.pie ?? payload?.data?.pie ?? null);
      setApiPieAlt(payload?.pieAlt ?? payload?.data?.pieAlt ?? null);
      setApiChartHints(
        payload?.chartHints ?? payload?.data?.chartHints ?? null
      );
      // Flexible normalization: try common shapes
      const monthly: Array<any> =
        payload?.monthly ||
        payload?.data?.monthly ||
        payload?.data ||
        payload ||
        [];
      const normalized = monthly
        .map((item: any, idx: number) => {
          const monthValue = item.month ?? item.m ?? idx + 1;
          const monthName =
            typeof monthValue === "number"
              ? months[(Math.max(1, Math.min(12, monthValue)) - 1) as number]
              : String(monthValue);
          const primaryKey = primaryMetricForProject(selectedProject);
          return {
            month: monthName,
            beneficiaries: Number(
              item[primaryKey] ??
                item.currentBeneficiaries ??
                item.distributedAnimals ??
                item.value ??
                item.count ??
                0
            ),
            target:
              item.target != null
                ? Number(item.target)
                : payload?.totals?.targetBeneficiaries ?? undefined,
          };
        })
        .filter((d: any) => !Number.isNaN(d.beneficiaries));
      setApiMonthlyData(normalized);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to load analytics");
      setApiMonthlyData([]);
      setApiTotals(null);
      setApiTotalBeneficiaries(null);
      setApiPie(null);
      setApiPieAlt(null);
      setApiChartHints(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnalytics = async () => {
    setShowAnalytics(true);
    await fetchAnalytics();
  };

  useEffect(() => {
    // Reset API data when inputs change
    setApiMonthlyData([]);
    setShowAnalytics(false);
    setErrorMessage("");
  }, [selectedCategory, selectedProject, selectedYear, selectedMonth]);

  // Get data for selected year and category
  const getBeneficiariesData = (): MonthlyDatum[] => {
    if (apiMonthlyData.length > 0) {
      return apiMonthlyData.map<MonthlyDatum>((d) => ({
        month:
          typeof d.month === "number"
            ? months[(d.month as number) - 1]
            : (d.month as string),
        beneficiaries: d.beneficiaries,
        target: d.target ?? apiTotals?.targetBeneficiaries ?? 0,
      }));
    }
    return [];
  };

  // Calculate total beneficiaries for the selected category and year
  const getTotalBeneficiaries = (): number => {
    if (apiTotalBeneficiaries != null) return Number(apiTotalBeneficiaries);
    if (typeof apiTotals?.currentBeneficiaries === "number") {
      return apiTotals.currentBeneficiaries;
    }
    const data: MonthlyDatum[] = getBeneficiariesData();
    return data.reduce(
      (sum: number, item: MonthlyDatum) => sum + item.beneficiaries,
      0
    );
  };

  // Calculate selected month beneficiaries
  const getSelectedMonthBeneficiaries = (): number => {
    if (apiMonthlyData.length > 0) {
      const monthData = apiMonthlyData.find((d) => {
        const name =
          typeof d.month === "number" ? months[d.month - 1] : String(d.month);
        return name === selectedMonth;
      });
      return Number(monthData?.beneficiaries || 0);
    }
    const data: MonthlyDatum[] = getBeneficiariesData();
    const monthData = data.find(
      (item: MonthlyDatum) => item.month === selectedMonth
    );
    return monthData?.beneficiaries || 0;
  };

  // Prefer API-provided pie.current for beneficiaries scope
  const getSelectedMonthCurrentFromPie = (): number => {
    if (apiPie && typeof apiPie.current === "number") {
      return Number(apiPie.current);
    }
    return getSelectedMonthBeneficiaries();
  };

  // Calculate target beneficiaries
  const getTargetBeneficiaries = (): number => {
    if (typeof apiTotals?.targetBeneficiaries === "number") {
      return apiTotals.targetBeneficiaries;
    }
    const firstWithTarget = apiMonthlyData.find((d) => d.target != null);
    return Number(firstWithTarget?.target || 0);
  };

  // Calculate current vs remaining data for pie chart
  const getCurrentVsRemainingData = () => {
    if (
      apiPie &&
      typeof apiPie.current === "number" &&
      typeof apiPie.remaining === "number"
    ) {
      return [
        {
          name: "Current Beneficiaries",
          value: apiPie.current,
          color: "#54D12B",
        },
        { name: "Remaining Target", value: apiPie.remaining, color: "#EF4444" },
      ];
    }
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
          <div />
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
                  !selectedCategory ||
                  !selectedProject ||
                  !selectedMonth ||
                  isLoading
                }
                aria-busy={isLoading}
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  {isLoading ? "Loading…" : "Show Analytics"}
                </span>
              </Button>
            </div>
          </Card>
        </section>

        {/* Analytics Charts */}
        {showAnalytics && (
          <div className="space-y-8 mt-12">

            {isLoading && (
              <Card className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-40 bg-gray-200 rounded"></div>
                </div>
              </Card>
            )}
            {errorMessage && (
              <Card className="p-4 text-red-600 bg-red-50 border-red-200">
                {errorMessage}
              </Card>
            )}
            {!isLoading &&
              !errorMessage &&
              getBeneficiariesData().length === 0 && (
                <Card className="p-4 text-gray-600 bg-gray-50 border-gray-200">
                  No analytics data returned for the selected filters.
                </Card>
              )}
            {/* Beneficiary Stats Cards */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Summary ({selectedMonth || "Month"} {selectedYear})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* For beneficiaries projects, show the selected month value explicitly */}
                {isBeneficiariesProject(selectedProject) && (
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-6 h-6 text-[#54D12B]" />
                      <span className="text-gray-700 text-sm">
                        Selected Month Beneficiaries
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {getSelectedMonthCurrentFromPie().toLocaleString()}
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      {selectedMonth} {selectedYear}
                    </p>
                  </Card>
                )}
                {summaryMetricsForProject(selectedProject).map((metric) => (
                  <Card key={metric.key as string} className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-6 h-6 text-[#54D12B]" />
                      <span className="text-gray-700 text-sm">
                        {metric.label}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {(apiTotals?.[metric.key] ?? 0).toLocaleString()}
                    </span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Charts */}
            <section>
              {!isNoChartsProject(selectedProject) && (
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                  Beneficiary Analytics for{" "}
                  {
                    currentOptions.find((opt) => opt.value === selectedProject)
                      ?.label
                  }{" "}
                  ({selectedYear})
                </h2>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {!isNoChartsProject(selectedProject) && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {selectedProject === "housing-villages"
                        ? "Monthly Houses"
                        : "Monthly Beneficiaries"}{" "}
                      ({selectedYear})
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getBeneficiariesData()}
                          barCategoryGap={20}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
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
                )}

                {!isNoChartsProject(selectedProject) && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {selectedProject === "housing-villages"
                        ? "House Condition Breakdown"
                        : "Current vs Remaining Beneficiaries"}{" "}
                      ({selectedMonth} {selectedYear})
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {isVillagesProject(selectedProject) &&
                          apiPieAlt?.slices ? (
                            <Pie
                              data={apiPieAlt.slices}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              nameKey="label"
                              dataKey="value"
                              outerRadius={80}
                              label={({ name, percent }) =>
                                `${name} ${
                                  percent ? (percent * 100).toFixed(0) : 0
                                }%`
                              }
                            >
                              {apiPieAlt.slices.map((s, idx) => (
                                <Cell
                                  key={idx}
                                  fill={
                                    s.label.toLowerCase().includes("good")
                                      ? "#54D12B"
                                      : "#EF4444"
                                  }
                                />
                              ))}
                            </Pie>
                          ) : (
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
                              {getCurrentVsRemainingData().map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                          )}
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
