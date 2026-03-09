import { useState, useEffect } from "react";
import { rentals as rentalsApi, products as productsApi } from '@/api/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, ShoppingBag, DollarSign, AlertCircle, TrendingUp, Clock, ChevronRight } from "lucide-react";
import RentalStatusBadge from "../components/rental/RentalStatusBadge";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const [rentalList, setRentalList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      rentalsApi.list(100),
      productsApi.list(),
    ]).then(([r, p]) => { setRentalList(r); setProductList(p); }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = rentalList.filter(r => ["confirmed","active","returned"].includes(r.status)).reduce((s, r) => s + (r.rental_cost || 0), 0);
  const activeRentals = rentalList.filter(r => r.status === "active").length;
  const pendingRentals = rentalList.filter(r => r.status === "pending").length;
  const overdueRentals = rentalList.filter(r => r.status === "overdue").length;

  const monthlyData = (() => {
    const months = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = format(d, "MMM");
      months[key] = 0;
    }
    rentalList.forEach(r => {
      if (!r.created_at) return;
      const key = format(new Date(r.created_at), "MMM");
      if (months[key] !== undefined) months[key] += (r.rental_cost || 0);
    });
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue: +revenue.toFixed(0) }));
  })();

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Rentals", value: activeRentals, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Approval", value: pendingRentals, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Total Products", value: productList.length, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your rental platform</p>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("AdminProducts")}>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Manage Products <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to={createPageUrl("AdminRentals")}>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Manage Rentals <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {label === "Pending Approval" && pendingRentals > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Action needed</span>
                )}
              </div>
              <div className="text-2xl font-bold text-foreground">{loading ? "—" : value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {overdueRentals > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-red-800">{overdueRentals} overdue rental{overdueRentals > 1 ? "s" : ""}</span>
            <span className="text-red-700 text-sm ml-2">require immediate attention.</span>
          </div>
          <Link to={createPageUrl("AdminRentals")} className="ml-auto text-red-700 text-sm font-medium underline">View</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Rentals</CardTitle>
            <Link to={createPageUrl("AdminRentals")} className="text-xs text-primary font-medium">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {rentalList.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.product_name}</p>
                  <p className="text-xs text-muted-foreground">{r.customer_name || r.customer_email}</p>
                </div>
                <RentalStatusBadge status={r.status} />
              </div>
            ))}
            {!loading && rentalList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No rentals yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
