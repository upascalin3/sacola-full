import { Metadata } from "next";
import AnalyticsPageContent from "../../components/AnalyticsPageContent";

export const metadata: Metadata = {
  title: "Analytics | Reports",
  description: "View analytics",
};

export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}
