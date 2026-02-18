import type { Metadata } from "next";
import React from "react";
import VisitorChart from "@/components/visitor/VisitorChart";
import DashboardStats from "@/components/dashboard/DashboardStats";

export const metadata: Metadata = {
  title:"Webprofile",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <VisitorChart />
    </div>
  );
}
