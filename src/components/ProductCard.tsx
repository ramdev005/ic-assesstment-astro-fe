import React from 'react';
import { Button } from './ui';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          SKU: <span className="font-mono">{product.sku}</span>
        </p>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {product.category && (
          <p className="text-xs text-gray-500 mb-2">
            Category: {product.category}
          </p>
        )}

        {product.brand && (
          <p className="text-xs text-gray-500 mb-3">
            Brand: {product.brand}
          </p>
        )}

        <p className="text-xs text-gray-400 mb-4">
          Created: {formatDate(product.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            Edit
          </Button>
          
          
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
