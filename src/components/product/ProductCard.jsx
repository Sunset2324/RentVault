import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Star, ArrowRight } from "lucide-react";

const conditionColors = {
  new: "bg-green-100 text-green-700",
  like_new: "bg-blue-100 text-blue-700",
  good: "bg-yellow-100 text-yellow-700",
  fair: "bg-orange-100 text-orange-700",
};

export default function ProductCard({ product }) {
  const available = (product.available_stock ?? 1) > 0;

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-secondary">
            <Tag className="w-12 h-12 text-primary/30" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.is_featured && (
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
          {!available && (
            <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
        </div>
        {product.condition && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColors[product.condition] || ""}`}>
              {product.condition.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-base leading-tight mb-1 line-clamp-1">{product.name}</h3>
        {product.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.short_description}</p>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-xl font-bold text-primary">${product.daily_rate}</span>
          <span className="text-xs text-muted-foreground">/day</span>
          {product.weekly_rate && (
            <span className="text-xs text-muted-foreground ml-2">· ${product.weekly_rate}/wk</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${available ? "text-green-600" : "text-destructive"}`}>
            {available ? `${product.available_stock} available` : "Out of stock"}
          </span>
          <Link to={`${createPageUrl("ProductDetail")}?id=${product.id}`}>
            <Button size="sm" disabled={!available} className="bg-primary hover:bg-primary/90 gap-1 text-xs">
              Rent Now <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}