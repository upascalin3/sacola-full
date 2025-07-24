import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import ProgressCharts from "./components/ProgressCharts";
import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

export const metadata = {
  title: "Dashboard | SACOLA",
};

const conservationData = [
  { year: "2021", value: 40 },
  { year: "2022", value: 48 },
  { year: "2023", value: 32 },
  { year: "2024", value: 56 },
  { year: "2025", value: 44 }, // current year
];
const conservationActive = 4; // index of the active bar (current year)
const socioEconomicData = [
  { year: "2021", value: 36 },
  { year: "2022", value: 44 },
  { year: "2023", value: 28 },
  { year: "2024", value: 40 },
  { year: "2025", value: 52 }, // current year
];
const socioEconomicActive = 4;

const recentActivities = [
  {
    icon: <CheckCircle className="text-[#54D12B] w-6 h-6" />,
    title: "Conservation Activity Added",
    description: "New tree planting event was added to Conservation.",
    time: "2 hours ago",
  },
  {
    icon: <FileText className="text-blue-500 w-6 h-6" />,
    title: "Report Submitted",
    description: "Monthly socio-economic report submitted.",
    time: "5 hours ago",
  },
  {
    icon: <AlertCircle className="text-yellow-500 w-6 h-6" />,
    title: "Profile Updated",
    description: "User profile information was updated.",
    time: "1 day ago",
  },
  {
    icon: <CheckCircle className="text-[#54D12B] w-6 h-6" />,
    title: "Socio-Economic Activity Added",
    description: "New training session added to Socio-Economic.",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <Sidebar />
      <main className="ml-64 py-7 px-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Welcome Back 👋
        </h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col justify-center items-start">
              <span className="text-gray-700 text-base mb-2">
                Conservation Activities
              </span>
              <span className="text-3xl font-bold text-gray-900">8</span>
            </Card>
            <Card className="p-6 flex flex-col justify-center items-start">
              <span className="text-gray-700 text-base mb-2">
                Socio-Economic Activities
              </span>
              <span className="text-3xl font-bold text-gray-900">12</span>
            </Card>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              href="/dashboard/conservation"
              className="px-6 py-2 rounded-full bg-[#54D12B] text-white font-semibold shadow-sm transition-colors hover:bg-[#54D12B] hover:text-white focus:bg-[#54D12B] focus:text-white"
            >
              Conservation
            </Link>
            <Link
              href="/dashboard/socio-economic"
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold transition-colors hover:bg-[#54D12B] hover:text-white focus:bg-[#54D12B] focus:text-white"
            >
              Socio-Economic
            </Link>
            <Link
              href="/dashboard/reports"
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold transition-colors hover:bg-[#54D12B] hover:text-white focus:bg-[#54D12B] focus:text-white"
            >
              Reports
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold transition-colors hover:bg-[#54D12B] hover:text-white focus:bg-[#54D12B] focus:text-white"
            >
              Profile
            </Link>
          </div>
        </section>
        {/* Recent Activity Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
            Recent Activity
          </h2>
          <Card className="p-6">
            <ul className="divide-y divide-gray-100">
              {recentActivities.slice(0, 4).map((activity, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {activity.title}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {activity.description}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <section>
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <ProgressCharts
            conservationData={conservationData}
            conservationActive={conservationActive}
            socioEconomicData={socioEconomicData}
            socioEconomicActive={socioEconomicActive}
          />
        </section>
      </main>
    </div>
  );
}
