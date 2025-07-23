import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import React from "react";

export const metadata = {
  title: "Dashboard | SACOLA",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FAFCF8]">
      <Sidebar />
      <main className="flex-1 p-12 pl-0">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Dashboard</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full bg-[#54D12B] text-white font-semibold shadow-sm">
              Conservation
            </button>
            <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold">
              Socio-Economic
            </button>
            <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold">
              Reports
            </button>
            <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold">
              Profile
            </button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="mb-2 text-gray-700">Conservation Progress</div>
              <div className="text-4xl font-bold mb-1">75%</div>
              <div className="text-sm text-gray-600 mb-4">
                Current Year{" "}
                <span className="text-[#54D12B] font-semibold">+10%</span>
              </div>
              <div className="flex gap-2 items-end h-16">
                <div className="w-4 h-10 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-12 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-8 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-14 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-11 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-2 text-gray-700">Socio-Economic Progress</div>
              <div className="text-4xl font-bold mb-1">60%</div>
              <div className="text-sm text-gray-600 mb-4">
                Current Year{" "}
                <span className="text-[#54D12B] font-semibold">+5%</span>
              </div>
              <div className="flex gap-2 items-end h-16">
                <div className="w-4 h-9 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-11 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-7 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-13 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
                <div className="w-4 h-10 bg-gray-100 rounded-t-md border-b-4 border-gray-300"></div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
