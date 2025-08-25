import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Conservation | SACOLA",
};

export default function ConservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
