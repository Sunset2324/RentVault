import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categories as categoriesApi, products as productsApi } from '@/api/db';
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
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

  return (
    <div>
      <HeroSection />
      <CategoryGrid categories={categoriesList} />
      <FeaturedProducts products={featuredProducts} />
      <HowItWorks />
    </div>
  );
}