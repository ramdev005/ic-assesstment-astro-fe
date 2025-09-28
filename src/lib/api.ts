import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  JSendResponse,
  JSendSuccessResponse,
} from "../types";
import { ApiError, JSendStatus } from "../types";

/**
 * API Client for communicating with the backend
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Handle empty responses (204 No Content, etc.)
        if (!response.data || response.status === 204) {
          return response;
        }

        // Handle JSEND responses
        const jsendResponse = response.data as JSendResponse;

        if (jsendResponse.status === JSendStatus.SUCCESS) {
          // Return the data directly for success responses
          response.data = jsendResponse.data;
          return response;
        } else {
          // Convert fail/error responses to ApiError
          const apiError = new ApiError(jsendResponse);
          return Promise.reject(apiError);
        }
      },
      (error: AxiosError) => {
        // Handle network/HTTP errors
        if (error.response) {
          const jsendResponse = error.response.data as JSendResponse;

          if (
            jsendResponse &&
            (jsendResponse.status === JSendStatus.FAIL ||
              jsendResponse.status === JSendStatus.ERROR)
          ) {
            const apiError = new ApiError(jsendResponse);

            // Handle specific status codes
            if (error.response.status === 401) {
              localStorage.removeItem("auth_token");
              // Only redirect if we're in a browser environment
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
            }

            return Promise.reject(apiError);
          }
        }

        // Handle non-JSEND errors (network errors, etc.)
        const networkError = new Error(
          error.message || "Network error occurred"
        );
        return Promise.reject(networkError);
      }
    );
  }

  // Product API methods
  async getProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.client.get(
      "/products"
    );
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.get(
      `/products/${id}`
    );
    return response.data;
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.post(
      "/products",
      product
    );
    return response.data;
  }

  async updateProduct(
    id: string,
    product: UpdateProductRequest
  ): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.patch(
      `/products/${id}`,
      product
    );
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
