"use client";

import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import {
  ActivityItem,
  getRecentActivities,
  subscribeToActivityUpdates,
} from "@/lib/activity";

const iconFor = (icon: string) => {
  switch (icon) {
    case "success":
      return <CheckCircle className="text-[#54D12B] w-6 h-6" />;
    case "edit":
      return <FileText className="text-blue-500 w-6 h-6" />;
    case "delete":
      return <AlertCircle className="text-red-500 w-6 h-6" />;
    case "warning":
      return <AlertCircle className="text-yellow-500 w-6 h-6" />;
    case "report":
      return <FileText className="text-blue-500 w-6 h-6" />;
    default:
      return <FileText className="text-gray-400 w-6 h-6" />;
  }
};

export default function DashboardPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setActivities(getRecentActivities());
    const unsubscribe = subscribeToActivityUpdates(() => {
      setActivities(getRecentActivities());
    });
    return unsubscribe;
  }, []);

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };
  return (
    <main className="ml-64 py-7 px-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Welcome Back 👋</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-8 flex items-center">
          <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
          Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col justify-center items-start">
            <span className="text-gray-700 text-base mb-2">
              Conservation Activities
            </span>
            <span className="text-3xl font-bold text-gray-900">5</span>
          </Card>
          <Card className="p-6 flex flex-col justify-center items-start">
            <span className="text-gray-700 text-base mb-2">
              Socio-Economic Activities
            </span>
            <span className="text-3xl font-bold text-gray-900">11</span>
          </Card>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-8 flex items-center">
          <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
          Quick Actions
        </h2>
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
        <h2 className="text-xl font-semibold mb-8 flex items-center">
          <div className="w-2 h-8 bg-[#54D12B] rounded-full mr-3"></div>
          Recent Activity
        </h2>
        <Card className="p-6">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No recent activity so far
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {activities.slice(0, 4).map((activity, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-shrink-0">{iconFor(activity.icon)}</div>
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
                    {timeAgo(activity.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}
