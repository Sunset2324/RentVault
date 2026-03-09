import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";

export default function FeaturedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Rentals</h2>
          <p className="text-muted-foreground mt-1">Our most popular picks</p>
        </div>
        <Link
          to={createPageUrl("ProductCatalog")}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
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
                    <span className="text-4xl font-bold text-primary/20">{product.name?.[0]}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                  {product.available_stock > 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Available</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Unavailable</Badge>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                {product.short_description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.short_description}</p>
                )}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">${product.daily_rate}</span>
                  <span className="text-sm text-muted-foreground">/ day</span>
                  {product.weekly_rate && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      ${product.weekly_rate}/wk
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}