import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Package, RotateCcw, AlertTriangle, XCircle } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-blue-100 text-blue-700 border-blue-200" },
  active: { label: "Active", icon: Package, className: "bg-green-100 text-green-700 border-green-200" },
  returned: { label: "Returned", icon: RotateCcw, className: "bg-gray-100 text-gray-700 border-gray-200" },
  overdue: { label: "Overdue", icon: AlertTriangle, className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export default function RentalStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`${config.className} border flex items-center gap-1 w-fit`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}