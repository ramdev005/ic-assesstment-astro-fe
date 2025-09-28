import { createProductSchema, updateProductSchema, stockUpdateSchema } from '../validations';

describe('Validation Schemas', () => {
  describe('createProductSchema', () => {
    it('validates a valid product', () => {
      const validProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        description: 'Test description',
        category: 'electronics',
        brand: 'Test Brand',
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const invalidProduct = {
        name: '',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Product name is required');
      }
    });

    it('rejects invalid SKU format', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'test-001', // lowercase
        price: 99.99,
        stockQuantity: 100,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('SKU must contain only uppercase letters, numbers, hyphens, and underscores');
      }
    });

    it('rejects negative price', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: -10,
        stockQuantity: 100,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be greater than 0');
      }
    });

    it('rejects negative stock quantity', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: -10,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Stock quantity cannot be negative');
      }
    });

    it('rejects invalid currency format', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        currency: 'usd', // lowercase
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a valid currency');
      }
    });

    it('rejects invalid image URLs', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        images: ['invalid-url'],
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid image URL');
      }
    });

    it('sets default values', () => {
      const product = {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
      };

      const result = createProductSchema.parse(product);
      expect(result.currency).toBe('USD');
      expect(result.images).toEqual([]);
    });
  });

  describe('updateProductSchema', () => {
    it('allows partial updates', () => {
      const partialUpdate = {
        name: 'Updated Product',
      };

      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates fields when provided', () => {
      const invalidUpdate = {
        name: '', // empty name should fail
        price: -10, // negative price should fail
      };

      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('stockUpdateSchema', () => {
    it('validates valid stock quantity', () => {
      const validStock = { quantity: 100 };
      const result = stockUpdateSchema.safeParse(validStock);
      expect(result.success).toBe(true);
    });

    it('rejects negative quantity', () => {
      const invalidStock = { quantity: -10 };
      const result = stockUpdateSchema.safeParse(invalidStock);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Quantity cannot be negative');
      }
    });

    it('rejects non-integer quantity', () => {
      const invalidStock = { quantity: 10.5 };
      const result = stockUpdateSchema.safeParse(invalidStock);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Quantity must be a whole number');
      }
    });
  });
});
