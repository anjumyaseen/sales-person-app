'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { dataStore } from '@/lib/data';
import { Product } from '@/types';
import {
  Plus,
  Search,
  Edit,
  Package,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setProducts(dataStore.getProducts());
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleAddProduct = (formData: FormData) => {
    const newProduct = dataStore.addProduct({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      inStock: formData.get('inStock') === 'true',
      imageUrl: formData.get('imageUrl') as string || undefined,
    });
    setProducts(dataStore.getProducts());
    setShowAddForm(false);
  };

  const ProductForm = ({ onSubmit, onCancel }: {
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="label">Product Name</label>
            <input
              name="name"
              type="text"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              className="input"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="label">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Category</label>
            <input
              name="category"
              type="text"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Image URL (optional)</label>
            <input
              name="imageUrl"
              type="url"
              className="input"
            />
          </div>
          <div>
            <label className="label">In Stock</label>
            <select name="inStock" className="input" required>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1">
              Add Product
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      {product.inStock ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

                {product.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <p className="line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    {product.category}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-lg font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full btn btn-primary text-sm">
                    Add to Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}