"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  Calendar,
  FileText,
  BarChart2,
  Download,
  TrendingUp,
  Activity,
  Clock,
  Leaf,
  Users,
  TreePine,
  Sprout,
  Eye,
  FileDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const tabs = [
  { label: "Report Generation", value: "generation", icon: FileText },
  { label: "Analytics", value: "analytics", icon: BarChart2 },
];

const projectCategories = [
  {
    label: "Conservation",
    value: "conservation",
    icon: TreePine,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Socio-Economic",
    value: "socio-economic",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
  },
];

type ProjectCategory = "conservation" | "socio-economic";
type ReportType = "monthly" | "annual";

interface ProjectOption {
  label: string;
  value: string;
  description: string;
}

interface GeneratedReport {
  id: number;
  name: string;
  category: string;
  projectType: string;
  reportType: ReportType;
  startDate: string;
  endDate: string;
  dateGenerated: string;
  status: "completed" | "processing";
  fileUrl?: string;
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

// Mock chart data
const conservationData = [
  { month: "Jan", projects: 3, impact: 85 },
  { month: "Feb", projects: 2, impact: 72 },
  { month: "Mar", projects: 4, impact: 91 },
  { month: "Apr", projects: 3, impact: 78 },
  { month: "May", projects: 5, impact: 95 },
  { month: "Jun", projects: 4, impact: 88 },
];

const socioEconomicData = [
  { month: "Jan", projects: 2, impact: 65 },
  { month: "Feb", projects: 3, impact: 78 },
  { month: "Mar", projects: 1, impact: 45 },
  { month: "Apr", projects: 4, impact: 82 },
  { month: "May", projects: 3, impact: 75 },
  { month: "Jun", projects: 2, impact: 68 },
];

const pieData = [
  { name: "Tree Planting", value: 35, color: "#54D12B" },
  { name: "Wildlife Protection", value: 25, color: "#10b981" },
  { name: "Community Development", value: 20, color: "#3b82f6" },
  { name: "Sustainable Agriculture", value: 15, color: "#1e40af" },
  { name: "Others", value: 5, color: "#6b7280" },
];

export default function ReportsPageContent() {
  const [activeTab, setActiveTab] = useState("generation");

  // Report Generation State
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "">("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Analytics State
  const analytics = {
    totalProjects: 24,
    conservationProjects: 14,
    socioEconomicProjects: 10,
    mostPopular: "Tree Planting",
    lastCreated: "2024-06-10",
  };

  // Analytics project type selector
  const [analyticsProjectType, setAnalyticsProjectType] =
    useState<ProjectCategory>("conservation");

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((res) => setTimeout(res, 2000));

    const categoryData = projectCategories.find(
      (cat) => cat.value === selectedCategory
    );
    const projectData = projectOptions[
      selectedCategory as ProjectCategory
    ]?.find((proj) => proj.value === selectedProject);

    const newReport: GeneratedReport = {
      id: Date.now(),
      name: `${projectData?.label} ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      category: categoryData?.label || "",
      projectType: projectData?.label || "",
      reportType,
      startDate,
      endDate,
      dateGenerated: new Date().toLocaleString(),
      status: "completed",
      fileUrl: `/reports/${Date.now()}.pdf`,
    };

    setGeneratedReports([newReport, ...generatedReports]);

    // Reset form
    setSelectedProject("");
    setStartDate("");
    setEndDate("");
    setIsGenerating(false);
  };

  const handlePreviewReport = (report: GeneratedReport) => {
    // Mock preview functionality
    window.open(report.fileUrl, '_blank');
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = report.fileUrl || '#';
    link.download = `${report.name}.pdf`;
    link.click();
  };

  const currentOptions: ProjectOption[] = selectedCategory
    ? projectOptions[selectedCategory as ProjectCategory]
    : [];

  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <main className="ml-64 py-7 px-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Reports & Analytics
        </h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors border-2 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#54D12B] text-white border-[#54D12B]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "generation" && (
          <div className="space-y-8">
            {/* Report Generation Form */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Generate Report
              </h2>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      onChange={(e) => setSelectedProject(e.target.value)}
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

                  {/* Report Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Report Type
                    </Label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as ReportType)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                    >
                      <option value="monthly">Monthly Report</option>
                      <option value="annual">Annual Report</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Date Range
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerateReport}
                    className="bg-[#54D12B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#54D12B]/90 transition-colors disabled:opacity-50"
                    disabled={isGenerating || !selectedCategory || !selectedProject || !startDate || !endDate}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generate Report
                      </span>
                    )}
                  </Button>
                </div>
              </Card>
            </section>

            {/* Recent Reports Section */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Recent Reports
              </h2>
              {generatedReports.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium mb-2">
                    No reports generated yet
                  </p>
                  <p className="text-gray-400 text-sm">
                    Generate your first report using the form above
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {generatedReports.map((report) => (
                    <Card key={report.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#54D12B]/10 rounded-lg">
                            <FileText className="w-6 h-6 text-[#54D12B]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {report.name}
                              </h4>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#54D12B]/10 text-[#54D12B]">
                                {report.category}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                {report.reportType}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              {report.projectType}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                {report.startDate} → {report.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {report.dateGenerated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {report.status}
                          </span>
                          <Button 
                            onClick={() => handlePreviewReport(report)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                          <Button 
                            onClick={() => handleDownloadReport(report)}
                            size="sm"
                            className="bg-[#54D12B] text-white hover:bg-[#54D12B]/90 flex items-center gap-2"
                          >
                            <FileDown className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Project Type Selector */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Project Analytics
              </h2>
              <div className="flex gap-4 mb-6">
                {projectCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() =>
                      setAnalyticsProjectType(cat.value as ProjectCategory)
                    }
                    className={`px-6 py-2 rounded-full font-semibold transition-colors border-2 ${
                      analyticsProjectType === cat.value
                        ? "bg-[#54D12B] text-white border-[#54D12B]"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Stats Cards */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">Total Projects</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {analytics.totalProjects}
                  </span>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TreePine className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">Conservation</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {analytics.conservationProjects}
                  </span>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">Socio-Economic</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {analytics.socioEconomicProjects}
                  </span>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-[#54D12B]" />
                    <span className="text-gray-700 text-sm">Most Popular</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 truncate">
                    {analytics.mostPopular}
                  </span>
                </Card>
              </div>
            </section>

            {/* Charts */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
                Project Trends
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {analyticsProjectType === "conservation"
                      ? "Conservation Projects Trend"
                      : "Socio-Economic Projects Trend"}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          analyticsProjectType === "conservation"
                            ? conservationData
                            : socioEconomicData
                        }
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="projects"
                          fill="#54D12B"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Project Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
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
