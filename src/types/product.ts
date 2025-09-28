/**
 * Product types for the frontend application
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  currency: string;
  stockQuantity: number;
  category?: string;
  images?: string[];
  isActive: boolean;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category?: string;
  images?: string[];
  brand?: string;
  currency?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
  images?: string[];
  brand?: string;
  currency?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
