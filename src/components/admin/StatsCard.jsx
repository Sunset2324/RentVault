import React from "react";
import { Card } from "@/components/ui/card";

export default function StatsCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <Card className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-1.5 ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}{trend}% from last month
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}