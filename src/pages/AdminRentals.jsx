import { useState, useEffect } from "react";
import { rentals as rentalsApi } from '@/api/db';
import RentalStatusBadge from "../components/rental/RentalStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Search, Loader2, Eye, Filter } from "lucide-react";

const STATUSES = ["all", "pending", "confirmed", "active", "returned", "overdue", "cancelled"];

export default function AdminRentals() {
  const [rentalList, setRentalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editFees, setEditFees] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    rentalsApi.list(200).then(setRentalList).finally(() => setLoading(false));
  }, []);

  const openDetail = (r) => {
    setSelected(r);
    setEditStatus(r.status);
    setEditNotes(r.notes || "");
    setEditFees(r.late_fees || 0);
  };

  const saveUpdate = async () => {
    setSaving(true);
    const updated = await rentalsApi.update(selected.id, {
      status: editStatus,
      notes: editNotes,
      late_fees: parseFloat(editFees) || 0,
      total_amount: (selected.rental_cost || 0) + (selected.deposit_amount || 0) + (parseFloat(editFees) || 0),
    });
    setRentalList(rentalList.map(r => r.id === selected.id ? { ...r, ...updated } : r));
    setSaving(false);
    setSelected(null);
  };

  const filtered = rentalList.filter(r => {
    const matchSearch = !search || r.product_name?.toLowerCase().includes(search.toLowerCase()) || r.customer_email?.toLowerCase().includes(search.toLowerCase()) || r.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Rentals</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} rental orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by product or customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-44 gap-2">
            <Filter className="w-3.5 h-3.5" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Period</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[180px] truncate">{r.product_name}</td>
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">{r.customer_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <div>{r.start_date ? format(new Date(r.start_date), "MMM d") : "—"} – {r.end_date ? format(new Date(r.end_date), "MMM d, yy") : "—"}</div>
                      <div>{r.duration_days} days</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">${r.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-3"><RentalStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => openDetail(r)} className="gap-1.5 text-xs">
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No rentals found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Manage Rental</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 py-1">
              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">{selected.product_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selected.customer_name || selected.customer_email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span className="font-medium">{selected.start_date} → {selected.end_date} ({selected.duration_days}d)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rental Cost</span><span className="font-medium">${selected.rental_cost?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Deposit</span><span className="font-medium">${selected.deposit_amount?.toFixed(2)}</span></div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["pending","confirmed","active","returned","overdue","cancelled"].map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Late Fees ($)</Label>
                <Input type="number" value={editFees} onChange={e => setEditFees(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Notes</Label>
                <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} placeholder="Internal notes..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={saveUpdate} disabled={saving} className="bg-primary hover:bg-primary/90 gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
