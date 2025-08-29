import type { Metadata } from "next";
import React from "react";
import SocioEconomicClientLayout from "./socio-economic-client-layout";

export const metadata: Metadata = {
  title: "Socio-Economic | SACOLA",
};

export default function SocioEconomicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocioEconomicClientLayout>{children}</SocioEconomicClientLayout>;
}
