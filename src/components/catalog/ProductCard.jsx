import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }) {
  const isAvailable = product.available_stock > 0;

  return (
    <Link
      to={createPageUrl("ProductDetail") + `?id=${product.id}`}
      className="group block rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent">
            <span className="text-3xl font-bold text-primary/20">{product.name?.[0]}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          {isAvailable ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">In Stock</Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 text-xs">Out of Stock</Badge>
          )}
        </div>
        {product.condition && product.condition !== "new" && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-card/80 backdrop-blur text-xs capitalize">
              {product.condition.replace("_", " ")}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        {product.short_description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.short_description}</p>
        )}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-primary">${product.daily_rate}</span>
          <span className="text-xs text-muted-foreground">/ day</span>
        </div>
        {(product.weekly_rate || product.deposit_amount) && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {product.weekly_rate && <span>${product.weekly_rate}/wk</span>}
            {product.weekly_rate && product.deposit_amount && <span>·</span>}
            {product.deposit_amount && <span>${product.deposit_amount} deposit</span>}
          </div>
        )}
      </div>
    </Link>
  );
}