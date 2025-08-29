import { redirect } from "next/navigation";

export const metadata = {
  title: "Analytics | SACOLA",
  description: "Project analytics.",
};

export default function Page() {
  redirect("/dashboard/reports/analytics");
}
