import { useState, useEffect } from "react";
import { products as productsApi } from '@/api/db';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package, Search, Loader2, Star } from "lucide-react";

const EMPTY = {
  name: "", short_description: "", description: "", daily_rate: "", weekly_rate: "", monthly_rate: "",
  deposit_amount: "", late_fee_per_day: "", total_stock: 1, available_stock: 1, condition: "new",
  image_url: "", is_featured: false, is_active: true, min_rental_days: 1, max_rental_days: 90,
};

export default function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    productsApi.list().then(setProductList).finally(() => setLoading(false));
  }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setDialog(true); };
  const openEdit = (p) => {
    setForm({ ...EMPTY, ...p, daily_rate: p.daily_rate || "", weekly_rate: p.weekly_rate || "", monthly_rate: p.monthly_rate || "", deposit_amount: p.deposit_amount || "", late_fee_per_day: p.late_fee_per_day || "" });
    setEditing(p);
    setDialog(true);
  };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      daily_rate: parseFloat(form.daily_rate) || 0,
      weekly_rate: parseFloat(form.weekly_rate) || null,
      monthly_rate: parseFloat(form.monthly_rate) || null,
      deposit_amount: parseFloat(form.deposit_amount) || 0,
      late_fee_per_day: parseFloat(form.late_fee_per_day) || 0,
      total_stock: parseInt(form.total_stock) || 1,
      available_stock: parseInt(form.available_stock) || 1,
    };
    if (editing) {
      const updated = await productsApi.update(editing.id, data);
      setProductList(productList.map(p => p.id === editing.id ? { ...p, ...updated } : p));
    } else {
      const created = await productsApi.create(data);
      setProductList([created, ...productList]);
    }
    setSaving(false);
    setDialog(false);
  };

  const remove = async (id) => {
    await productsApi.delete(id);
    setProductList(productList.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const filtered = productList.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  const F = ({ label, id, type = "text", ...rest }) => (
    <div>
      <Label htmlFor={id} className="text-xs mb-1 block">{label}</Label>
      <Input id={id} type={type} {...rest} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
          <p className="text-muted-foreground mt-1">{productList.length} products total</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Daily Rate</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 m-2.5 text-muted-foreground" />}
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-1">
                          {p.name}{p.is_featured && <Star className="w-3 h-3 text-primary fill-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.condition?.replace("_"," ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-medium text-primary">${p.daily_rate}/day</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium ${p.available_stock > 0 ? "text-green-600" : "text-destructive"}`}>
                      {p.available_stock}/{p.total_stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={p.is_active ? "border-green-200 text-green-700 bg-green-50" : "border-gray-200 text-gray-500 bg-gray-50"}>
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)} className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(p.id)} className="w-8 h-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <F label="Product Name *" id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Canon EOS R5 Camera" />
            <F label="Image URL" id="img" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
            <div>
              <Label className="text-xs mb-1 block">Short Description</Label>
              <Input value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} placeholder="Brief summary shown in cards" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Full Description</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} placeholder="Detailed product description..." />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <F label="Daily Rate ($) *" id="dr" type="number" value={form.daily_rate} onChange={e => setForm({...form, daily_rate: e.target.value})} placeholder="25" />
              <F label="Weekly Rate ($)" id="wr" type="number" value={form.weekly_rate} onChange={e => setForm({...form, weekly_rate: e.target.value})} placeholder="120" />
              <F label="Monthly Rate ($)" id="mr" type="number" value={form.monthly_rate} onChange={e => setForm({...form, monthly_rate: e.target.value})} placeholder="350" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Security Deposit ($)" id="dep" type="number" value={form.deposit_amount} onChange={e => setForm({...form, deposit_amount: e.target.value})} placeholder="100" />
              <F label="Late Fee / Day ($)" id="lf" type="number" value={form.late_fee_per_day} onChange={e => setForm({...form, late_fee_per_day: e.target.value})} placeholder="15" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <F label="Total Stock" id="ts" type="number" value={form.total_stock} onChange={e => setForm({...form, total_stock: e.target.value})} />
              <F label="Available Stock" id="as" type="number" value={form.available_stock} onChange={e => setForm({...form, available_stock: e.target.value})} />
              <F label="Min Days" id="mind" type="number" value={form.min_rental_days} onChange={e => setForm({...form, min_rental_days: e.target.value})} />
              <F label="Max Days" id="maxd" type="number" value={form.max_rental_days} onChange={e => setForm({...form, max_rental_days: e.target.value})} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Condition</Label>
              <Select value={form.condition} onValueChange={v => setForm({...form, condition: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["new","like_new","good","fair"].map(c => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={v => setForm({...form, is_featured: v})} id="feat" />
                <Label htmlFor="feat" className="text-sm cursor-pointer">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} id="actv" />
                <Label htmlFor="actv" className="text-sm cursor-pointer">Active Listing</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.name || !form.daily_rate} className="bg-primary hover:bg-primary/90 gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Product?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => remove(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}