import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product } from "../types";
import { apiClient } from "../lib/api";
import { ErrorHandler } from "../lib/error-handler";

interface ProductState {
  // State
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await apiClient.getProducts();
          set({ products, loading: false });
        } catch (error) {
          const errorMessage = ErrorHandler.getErrorMessage(error);
          ErrorHandler.logError(error, "fetchProducts");

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      fetchProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const product = await apiClient.getProduct(id);
          set({ selectedProduct: product, loading: false });
        } catch (error) {
          const errorMessage = ErrorHandler.getErrorMessage(error);
          ErrorHandler.logError(error, "fetchProduct");

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      createProduct: async (productData) => {
        set({ loading: true, error: null });
        try {
          const newProduct = await apiClient.createProduct(productData);
          set((state) => ({
            products: [...state.products, newProduct],
            loading: false,
          }));
        } catch (error) {
          const errorMessage = ErrorHandler.getErrorMessage(error);
          ErrorHandler.logError(error, "createProduct");

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      updateProduct: async (id: string, productData) => {
        set({ loading: true, error: null });
        try {
          const updatedProduct = await apiClient.updateProduct(id, productData);
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? updatedProduct : product
            ),
            selectedProduct:
              state.selectedProduct?.id === id
                ? updatedProduct
                : state.selectedProduct,
            loading: false,
          }));
        } catch (error) {
          const errorMessage = ErrorHandler.getErrorMessage(error);
          ErrorHandler.logError(error, "updateProduct");

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await apiClient.deleteProduct(id);
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            selectedProduct:
              state.selectedProduct?.id === id ? null : state.selectedProduct,
            loading: false,
          }));
        } catch (error) {
          const errorMessage = ErrorHandler.getErrorMessage(error);
          ErrorHandler.logError(error, "deleteProduct");

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      setSelectedProduct: (product) => {
        set({ selectedProduct: product });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "product-store",
    }
  )
);
