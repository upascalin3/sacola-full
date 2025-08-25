import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Socio-Economic | SACOLA",
};

export default function SocioEconomicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
