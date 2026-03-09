import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { products as productsApi, categories as categoriesApi, rentals as rentalsApi } from '@/api/db';
import { useAuth } from '@/lib/AuthContext';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RentalBookingForm from "@/components/rental/RentalBookingForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, Star, Shield } from "lucide-react";

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsApi.get(productId),
    enabled: !!productId,
  });

  const { data: category } = useQuery({
    queryKey: ["category", product?.category_id],
    queryFn: () => categoriesApi.filter({ id: product.category_id }).then(d => d?.[0]),
    enabled: !!product?.category_id,
  });

  const bookMutation = useMutation({
    mutationFn: async (bookingData) => {
      await rentalsApi.create({
        ...bookingData,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        customer_email: user.email,
        customer_name: user.user_metadata?.full_name || user.email,
        status: "pending",
      });
      await productsApi.update(product.id, {
        available_stock: Math.max(0, (product.available_stock || 1) - 1),
      });
    },
    onSuccess: () => {
      toast.success("Rental booked successfully!", { description: "Check your rentals page for status." });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-6 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3"><Skeleton className="aspect-[4/3] rounded-xl" /></div>
        <div className="lg:col-span-2"><Skeleton className="h-64 rounded-xl" /></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <Link to={createPageUrl("ProductCatalog")} className="text-primary hover:underline mt-2 inline-block">Back to catalog</Link>
    </div>
  );

  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={createPageUrl("ProductCatalog")} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to catalog
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border">
            {allImages.length > 0 ? (
              <img src={allImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent">
                <span className="text-6xl font-bold text-primary/15">{product.name?.[0]}</span>
              </div>
            )}
          </div>
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {category && <Badge variant="secondary">{category.name}</Badge>}
                {product.condition && <Badge variant="outline" className="capitalize">{product.condition.replace("_", " ")}</Badge>}
                {product.is_featured && <Badge className="bg-primary text-primary-foreground"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            </div>
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
            <Separator />
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> ${product.deposit_amount || 0} deposit</span>
              <span>{product.available_stock || 0} in stock</span>
              <span>Min {product.min_rental_days || 1} day · Max {product.max_rental_days || 90} days</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <RentalBookingForm product={product} onSubmit={bookMutation.mutate} isSubmitting={bookMutation.isPending} />
        </div>
      </div>
    </div>
  );
}
