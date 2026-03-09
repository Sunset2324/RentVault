import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { products as productsApi, categories as categoriesApi } from '@/api/db';
import CatalogFilters from "@/components/catalog/CatalogFilters";
import ProductCard from "@/components/catalog/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";

export default function ProductCatalog() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "all";
  const [filters, setFilters] = useState({ search: "", category: initialCategory, condition: "all", sort: "newest" });

  const { data: productList, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.filter({ is_active: true }),
    initialData: [],
  });

  const { data: categoriesList } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
    initialData: [],
  });

  const filteredProducts = useMemo(() => {
    let result = [...productList];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.short_description?.toLowerCase().includes(q));
    }
    if (filters.category !== "all") result = result.filter(p => p.category_id === filters.category);
    if (filters.condition !== "all") result = result.filter(p => p.condition === filters.condition);
    switch (filters.sort) {
      case "price_low": result.sort((a, b) => (a.daily_rate || 0) - (b.daily_rate || 0)); break;
      case "price_high": result.sort((a, b) => (b.daily_rate || 0) - (a.daily_rate || 0)); break;
      case "name": result.sort((a, b) => (a.name || "").localeCompare(b.name || "")); break;
      default: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return result;
  }, [productList, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-muted-foreground mt-1">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available for rent</p>
      </div>
      <CatalogFilters categories={categoriesList} filters={filters} onFilterChange={setFilters} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <Skeleton className="aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <PackageSearch className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
