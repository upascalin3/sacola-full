"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
