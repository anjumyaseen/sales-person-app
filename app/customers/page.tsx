'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { dataStore } from '@/lib/data';
import { Customer } from '@/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin,
  DollarSign,
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setCustomers(dataStore.getCustomers());
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (formData: FormData) => {
    const newCustomer = dataStore.addCustomer({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      address: formData.get('address') as string,
      status: formData.get('status') as 'active' | 'inactive' | 'prospect',
      lastContact: new Date(),
      totalValue: 0,
    });
    setCustomers(dataStore.getCustomers());
    setShowAddForm(false);
  };

  const handleEditCustomer = (formData: FormData) => {
    if (!editingCustomer) return;
    
    dataStore.updateCustomer(editingCustomer.id, {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      address: formData.get('address') as string,
      status: formData.get('status') as 'active' | 'inactive' | 'prospect',
    });
    setCustomers(dataStore.getCustomers());
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      dataStore.deleteCustomer(id);
      setCustomers(dataStore.getCustomers());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CustomerForm = ({ customer, onSubmit, onCancel }: {
    customer?: Customer;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </h3>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              name="name"
              type="text"
              defaultValue={customer?.name}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={customer?.email}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={customer?.phone}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Company</label>
            <input
              name="company"
              type="text"
              defaultValue={customer?.company}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea
              name="address"
              defaultValue={customer?.address}
              className="input"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" defaultValue={customer?.status} className="input" required>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1">
              {customer ? 'Update' : 'Add'} Customer
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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600">Manage your customer relationships</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    {customer.company}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {customer.address}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Value: ${customer.totalValue.toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last Contact: {customer.lastContact.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Customer Since: {customer.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <CustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Customer Form */}
      {editingCustomer && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleEditCustomer}
          onCancel={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
}