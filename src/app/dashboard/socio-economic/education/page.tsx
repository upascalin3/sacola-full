"use client";

import React from "react";
import Link from "next/link";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Building, GraduationCap } from "lucide-react";

const educationCategories = [
  {
    id: "materials",
    title: "MATERIALS",
    icon: Package,
    href: "/dashboard/socio-economic/education/materials",
    description: "Educational materials and supplies"
  },
  {
    id: "infrastructures",
    title: "INFRASTRUCTURES",
    icon: Building,
    href: "/dashboard/socio-economic/education/infrastructures",
    description: "School buildings and facilities"
  },
  {
    id: "students",
    title: "SUPPORTED STUDENTS",
    icon: GraduationCap,
    href: "/dashboard/socio-economic/education/students",
    description: "Students receiving support"
  }
];

export default function EducationPage() {
  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 tracking-wide">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <Link href={category.href}>
                        <Button 
                          className="bg-[#54D12B] hover:bg-[#43b71f] text-white px-6 py-2 rounded-md font-medium"
                        >
                          View Category
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}