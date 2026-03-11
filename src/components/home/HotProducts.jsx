import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, TrendingUp } from "lucide-react";

export default function HotProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-3">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              Trending Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hot & Popular</h2>
            <p className="text-muted-foreground mt-1">Most rented products this week</p>
          </div>
          <Link
            to={createPageUrl("ProductCatalog")}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="min-w-[220px] sm:min-w-0"
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                      <span className="text-4xl font-bold text-orange-200">{product.name?.[0]}</span>
                    </div>
                  )}
                  {/* Hot badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-orange-500 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" /> Hot
                    </Badge>
                    {product.available_stock > 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Available</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Unavailable</Badge>
                    )}
                  </div>
                  {/* Rank number */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white text-xs font-bold flex items-center justify-center">
                    #{i + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  {product.short_description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.short_description}</p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">${product.daily_rate}</span>
                    <span className="text-xs text-muted-foreground">/ day</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 rounded-2xl bg-gradient-to-r from-primary to-primary/70 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-primary-foreground"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">First Rental Special!</h3>
              <p className="text-primary-foreground/80 text-sm mt-0.5">Get 10% off your first rental order. Limited time offer.</p>
            </div>
          </div>
          <Link
            to={createPageUrl("ProductCatalog")}
            className="flex-shrink-0 px-6 py-2.5 bg-white text-primary font-semibold rounded-full text-sm hover:bg-white/90 transition-colors"
          >
            Claim Now →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
