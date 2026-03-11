import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categories as categoriesApi, products as productsApi } from '@/api/db';
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HotProducts from "@/components/home/HotProducts";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  const { data: categoriesList } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
    initialData: [],
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productsApi.filter({ is_featured: true, is_active: true }),
    initialData: [],
  });

  const { data: allProducts } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => productsApi.filter({ is_active: true }),
    initialData: [],
  });

  // Ambil 4 produk pertama sebagai "hot products"
  const hotProducts = allProducts.slice(0, 4);

  return (
    <div>
      <HeroSection />
      <CategoryGrid categories={categoriesList} />
      <HotProducts products={hotProducts} />
      <FeaturedProducts products={featuredProducts} />
      <HowItWorks />
    </div>
  );
}
