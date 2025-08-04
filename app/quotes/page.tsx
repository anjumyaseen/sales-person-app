'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { dataStore } from '@/lib/data';
import { Quote, Customer, Product } from '@/types';
import {
  Plus,
  Search,
  FileText,
  DollarSign,
  Calendar,
  User,
  Eye,
  Send,
  Download,
} from 'lucide-react';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuotes(dataStore.getQuotes());
    setCustomers(dataStore.getCustomers());
    setProducts(dataStore.getProducts());
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddQuote = (formData: FormData) => {
    const customerId = formData.get('customerId') as string;
    const customer = customers.find(c => c.id === customerId);
    
    // Parse selected products
    const selectedProducts = JSON.parse(formData.get('selectedProducts') as string);
    const items = selectedProducts.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        unitPrice: product?.price || 0,
        total: item.quantity * (product?.price || 0),
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const newQuote = dataStore.addQuote({
      customerId,
      customerName: customer?.name || '',
      items,
      subtotal,
      tax,
      total,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });
    setQuotes(dataStore.getQuotes());
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const QuoteForm = ({ onSubmit, onCancel }: {
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => {
    const [selectedProducts, setSelectedProducts] = useState<Array<{productId: string, quantity: number}>>([]);

    const addProduct = () => {
      setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
    };

    const updateProduct = (index: number, field: string, value: any) => {
      const updated = [...selectedProducts];
      updated[index] = { ...updated[index], [field]: value };
      setSelectedProducts(updated);
    };

    const removeProduct = (index: number) => {
      setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Create New Quote</h3>
          <form action={(formData) => {
            formData.append('selectedProducts', JSON.stringify(selectedProducts));
            onSubmit(formData);
          }} className="space-y-4">
            <div>
              <label className="label">Customer</label>
              <select name="customerId" className="input" required>
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Products</label>
              <div className="space-y-3">
                {selectedProducts.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                        className="input"
                        required
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                        className="input"
                        placeholder="Qty"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="btn btn-danger px-3"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProduct}
                  className="btn btn-secondary"
                >
                  Add Product
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary flex-1">
                Create Quote
              </button>
              <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const QuoteViewer = ({ quote, onClose }: { quote: Quote; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Quote #{quote.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Quote Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
              <p className="text-gray-600">{quote.customerName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quote Details:</h4>
              <p className="text-sm text-gray-600">Date: {quote.createdAt.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Valid Until: {quote.validUntil.toLocaleDateString()}</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                {quote.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quote Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Items:</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quote Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${quote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${quote.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${quote.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button className="btn btn-primary flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Send Quote
            </button>
            <button className="btn btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
              <p className="text-gray-600">Create and manage sales quotes</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Quote
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Quotes List */}
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quote #{quote.id}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                        {quote.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {quote.customerName}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${quote.total.toFixed(2)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created: {quote.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Valid Until: {quote.validUntil.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {quote.items.length} item(s) • {quote.items.reduce((sum, item) => sum + item.quantity, 0)} total quantity
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewingQuote(quote)}
                      className="btn btn-secondary flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    {quote.status === 'draft' && (
                      <button className="btn btn-primary flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No quotes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Quote Form */}
      {showAddForm && (
        <QuoteForm
          onSubmit={handleAddQuote}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Quote Viewer */}
      {viewingQuote && (
        <QuoteViewer
          quote={viewingQuote}
          onClose={() => setViewingQuote(null)}
        />
      )}
    </div>
  );
}