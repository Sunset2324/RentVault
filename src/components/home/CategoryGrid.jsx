import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-muted-foreground mt-1">Find exactly what you need</p>
        </div>
        <Link
          to={createPageUrl("ProductCatalog")}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.filter(c => c.is_active !== false).map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={createPageUrl("ProductCatalog") + `?category=${cat.id}`}
              className="group block relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <span className="text-3xl font-bold text-primary/20">{cat.name?.[0]}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}