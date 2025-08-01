"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
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
import Link from "next/link";

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

export default function ReportsPageContent() {
  const [isLoading, setIsLoading] = useState(true);

  // Report Generation State
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | ""
  >("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("monthly");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  // Generate years array (2020 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 },
    (_, i) => 2020 + i
  ).reverse();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((res) => setTimeout(res, 2000));

    const categoryData = projectCategories.find(
      (cat) => cat.value === selectedCategory
    );
    const projectData = projectOptions[
      selectedCategory as ProjectCategory
    ]?.find((proj) => proj.value === selectedProject);

    // Set date range based on report type
    let reportStartDate = startDate;
    let reportEndDate = endDate;

    if (reportType === "annual") {
      reportStartDate = `${selectedYear}-01-01`;
      reportEndDate = `${selectedYear}-12-31`;
    }

    const newReport: GeneratedReport = {
      id: Date.now(),
      name: `${projectData?.label} ${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Report`,
      category: categoryData?.label || "",
      projectType: projectData?.label || "",
      reportType,
      startDate: reportStartDate,
      endDate: reportEndDate,
      dateGenerated: new Date().toLocaleString(),
      status: "completed",
      fileUrl: `/reports/${Date.now()}.pdf`,
    };

    setGeneratedReports([newReport, ...generatedReports]);

    // Reset form
    setSelectedProject("");
    if (reportType === "monthly") {
      setStartDate("");
      setEndDate("");
    }
    setIsGenerating(false);
  };

  const handlePreviewReport = (report: GeneratedReport) => {
    setPreviewReport(report);
    setShowPreview(true);
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // Create a text file with report content (since we can't generate actual PDFs)
    const reportContent = `
${report.name}
===============================================

REPORT DETAILS:
- Category: ${report.category}
- Project Type: ${report.projectType}
- Report Type: ${report.reportType}
- Date Range: ${report.startDate} to ${report.endDate}
- Generated: ${report.dateGenerated}

REPORT CONTENT:
This is a ${report.reportType} report for ${report.projectType} 
in the ${report.category} category.

The report covers the period from ${report.startDate} to ${report.endDate} 
and contains detailed analytics and metrics related to the project performance.

SUMMARY:
This report provides a comprehensive overview of the ${report.projectType} 
project performance during the specified reporting period. All metrics and 
data have been analyzed and validated according to standard reporting procedures.

Generated by: SACOLA Data Management System
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewReport(null);
  };

  const currentOptions: ProjectOption[] = selectedCategory
    ? projectOptions[selectedCategory as ProjectCategory]
    : [];

  if (isLoading) {
    return (
      <div className="bg-[#FAFCF8] min-h-screen">
        <main className="ml-64 py-7 px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-8">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <main className="ml-64 py-7 px-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Report Generation
          </h1>
          <Link
            href="/dashboard/reports/analytics"
            className="px-6 py-2 rounded-full bg-[#54D12B] text-white font-semibold shadow-sm transition-colors hover:bg-[#54D12B]/90 flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            View Analytics
          </Link>
        </div>

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

              {/* Year Selection - Only show for Annual Reports */}
              {reportType === "annual" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Year
                  </Label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Range - Only show for Monthly Reports */}
              {reportType === "monthly" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Date Range
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                        placeholder="Start Date"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#54D12B] focus:ring-2 focus:ring-[#54D12B]/20 transition-colors"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                className="bg-[#54D12B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#54D12B]/90 transition-colors disabled:opacity-50"
                disabled={
                  isGenerating ||
                  !selectedCategory ||
                  !selectedProject ||
                  (reportType === "monthly" && (!startDate || !endDate))
                }
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
        <section className="mt-12">
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
      </main>

      {/* Preview Modal */}
      {showPreview && previewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {previewReport.name}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Category:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {previewReport.category}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Project Type:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {previewReport.projectType}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Report Type:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {previewReport.reportType}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Date Range:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {previewReport.startDate} to {previewReport.endDate}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Report Content Preview
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      This is a preview of the {previewReport.reportType} report
                      for {previewReport.projectType}
                      in the {previewReport.category} category.
                    </p>
                    <p className="text-gray-700 mb-3">
                      The report covers the period from{" "}
                      {previewReport.startDate} to {previewReport.endDate}
                      and contains detailed analytics, metrics, and insights
                      related to the project performance.
                    </p>
                    <p className="text-gray-700">
                      Key highlights include beneficiary statistics, project
                      milestones, budget utilization, and recommendations for
                      future improvements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={closePreview}
                variant="outline"
                className="px-4 py-2"
              >
                Close
              </Button>
              <Button
                onClick={() => handleDownloadReport(previewReport)}
                className="bg-[#54D12B] text-white px-4 py-2 rounded-lg hover:bg-[#54D12B]/90 transition-colors flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
