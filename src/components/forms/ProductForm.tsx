import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea, Select } from "../ui";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductFormData,
  type UpdateProductFormData,
} from "../../lib/validations";
import { CURRENCY_OPTIONS, CATEGORY_OPTIONS } from "../../lib/constants";

// Create a union type for form data that handles both create and edit cases
type ProductFormData = CreateProductFormData | UpdateProductFormData;
import type { Product } from "../../types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(product ? updateProductSchema : createProductSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          sku: product.sku,
          price: product.price,
          stockQuantity: product.stockQuantity,
          category: product.category || "",
          images: product.images
            ? [...product.images, "", "", ""].slice(0, 3)
            : ["", "", ""],
          brand: product.brand || "",
          currency: product.currency,
        }
      : {
          currency: "USD",
          images: ["", "", ""], // Initialize with empty strings for the 3 image fields
        },
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      if (!product) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-2">
          <Input
            label="Product Name *"
            {...register("name")}
            error={errors.name?.message}
            placeholder="Enter product name"
            disabled={loading}
          />
        </div>

        {/* SKU */}
        <Input
          label="SKU *"
          {...register("sku")}
          error={errors.sku?.message}
          placeholder="e.g., PROD-001"
          disabled={loading}
          helperText="Use uppercase letters, numbers, hyphens, and underscores only"
        />

        {/* Price */}
        <Input
          label="Price *"
          type="number"
          step="0.01"
          min="0.01"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
          placeholder="0.00"
          disabled={loading}
        />

        {/* Stock Quantity */}
        <Input
          label="Stock Quantity *"
          type="number"
          min="0"
          {...register("stockQuantity", { valueAsNumber: true })}
          error={errors.stockQuantity?.message}
          placeholder="0"
          disabled={loading}
        />

        {/* Currency */}
        <Select
          label="Currency *"
          name="currency"
          value={watch("currency") || ""}
          onChange={(value) => setValue("currency", value)}
          error={errors.currency?.message}
          options={CURRENCY_OPTIONS}
          placeholder="Select currency"
          disabled={loading}
          helperText="Select the currency for pricing"
        />

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={watch("category") || ""}
          onChange={(value) => setValue("category", value)}
          error={errors.category?.message}
          options={CATEGORY_OPTIONS}
          placeholder="Select category"
          disabled={loading}
          helperText="Choose the product category"
        />

        {/* Brand */}
        <Input
          label="Brand"
          {...register("brand")}
          error={errors.brand?.message}
          placeholder="e.g., Apple"
          disabled={loading}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        {...register("description")}
        error={errors.description?.message}
        placeholder="Enter product description"
        rows={4}
        disabled={loading}
      />

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URLs
        </label>
        <div className="space-y-2">
          {[0, 1, 2].map((index) => (
            <Input
              key={index}
              {...register(`images.${index}` as const)}
              error={errors.images?.[index]?.message}
              placeholder={`Image URL ${index + 1} (optional)`}
              disabled={loading}
            />
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Add up to 3 image URLs (optional)
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};
