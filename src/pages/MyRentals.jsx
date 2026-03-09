import { useState, useEffect } from "react";
import { rentals as rentalsApi } from '@/api/db';
import { useAuth } from '@/lib/AuthContext';
import RentalStatusBadge from "../components/rental/RentalStatusBadge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShoppingBag, Calendar, Clock, DollarSign, Package, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyRentals() {
  const { user } = useAuth();
  const [rentalList, setRentalList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      rentalsApi.filter({ customer_email: user.email }, 50)
        .then(setRentalList).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Rentals</h1>
        <p className="text-muted-foreground mt-1">Track and manage your rental orders</p>
      </div>
      {rentalList.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No rentals yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Start browsing to find products you'd like to rent.</p>
          <Link to={createPageUrl("ProductCatalog")}>
            <Button className="bg-primary hover:bg-primary/90">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rentalList.map(rental => (
            <div key={rental.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {rental.product_image ? (
                    <img src={rental.product_image} alt={rental.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-base truncate">{rental.product_name}</h3>
                    <RentalStatusBadge status={rental.status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{rental.start_date ? format(new Date(rental.start_date), "MMM d") : "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{rental.end_date ? format(new Date(rental.end_date), "MMM d, yyyy") : "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{rental.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      <span>${rental.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>
                  {rental.notes && <p className="text-xs text-muted-foreground mt-2 bg-muted/50 px-3 py-1.5 rounded-lg">{rental.notes}</p>}
                </div>
              </div>
              <div className="border-t border-border px-5 py-3 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                <span>Order #{rental.id?.slice(-8).toUpperCase()}</span>
                <span>Booked {rental.created_at ? format(new Date(rental.created_at), "MMM d, yyyy") : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}