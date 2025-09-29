import React, { useState, useEffect } from 'react';
import { Button, Modal } from './ui';
import { ProductForm } from './forms';
import { ProductList } from './ProductList';
import { useProductStore } from '../stores/productStore';
import type { CreateProductFormData, UpdateProductFormData } from '../lib/validations';

// Create a union type for form data that handles both create and edit cases
type ProductFormData = CreateProductFormData | UpdateProductFormData;
import type { Product } from '../types';

export const ProductManagementApp: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  } = useProductStore();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load products on component mount
  useEffect(() => {
    if (isClient) {
      // Try to fetch products but don't block UI if it fails
      fetchProducts().catch((error) => {
        console.warn('Failed to fetch products on mount:', error);
        setApiError('Unable to connect to the server. Please check if the backend is running.');
        // Component will still render with empty products array
      });
    }
  }, [fetchProducts, isClient]);

  // Show loading state until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle create product
  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Filter out empty strings from images array
      const productData = {
        ...data,
        images: data.images?.filter(img => img.trim() !== '') || [],
        isActive: true, // New products are active by default
      };
      await createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      setShowCreateModal(false);
      setApiError(null); // Clear any previous API errors
    } catch (error) {
      console.error('Failed to create product:', error);
      setApiError('Failed to create product. Please try again.');
    }
  };

  // Handle edit product
  const handleEditProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    try {
      // Filter out empty strings from images array
      const cleanedData = {
        ...data,
        images: data.images?.filter(img => img.trim() !== '') || []
      };
      
      await updateProduct(editingProduct.id, cleanedData as UpdateProductFormData);
      setShowEditModal(false);
      setEditingProduct(null);
      setApiError(null); // Clear any previous API errors
    } catch (error) {
      console.error('Failed to update product:', error);
      setApiError('Failed to update product. Please try again.');
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Confirm delete product
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      await deleteProduct(deletingProduct.id);
      setShowDeleteModal(false);
      setDeletingProduct(null);
      setApiError(null); // Clear any previous API errors
    } catch (error) {
      console.error('Failed to delete product:', error);
      setApiError('Failed to delete product. Please try again.');
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  // Handle edit button click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory and details
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              Add New Product
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {(error || apiError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error || apiError}</p>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" onClick={() => {
                    clearError();
                    setApiError(null);
                  }}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductList
          products={products}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteProduct}
        />
      </main>

      {/* Create Product Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Product"
        size="xl"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowCreateModal(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="xl"
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleEditProduct}
            onCancel={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title="Delete Product"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Product
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <strong>"{deletingProduct?.name}"</strong>?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              SKU: {deletingProduct?.sku}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              loading={loading}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};