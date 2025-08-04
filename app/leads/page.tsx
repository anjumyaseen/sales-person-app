'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { dataStore } from '@/lib/data';
import { Lead, Customer } from '@/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    setLeads(dataStore.getLeads());
    setCustomers(dataStore.getCustomers());
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || lead.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const handleAddLead = (formData: FormData) => {
    const customerId = formData.get('customerId') as string;
    const customer = customers.find(c => c.id === customerId);
    
    const newLead = dataStore.addLead({
      customerId,
      customerName: customer?.name || '',
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      value: Number(formData.get('value')),
      stage: formData.get('stage') as Lead['stage'],
      probability: Number(formData.get('probability')),
      expectedCloseDate: new Date(formData.get('expectedCloseDate') as string),
      assignedTo: formData.get('assignedTo') as string,
    });
    setLeads(dataStore.getLeads());
    setShowAddForm(false);
  };

  const handleEditLead = (formData: FormData) => {
    if (!editingLead) return;
    
    const customerId = formData.get('customerId') as string;
    const customer = customers.find(c => c.id === customerId);
    
    dataStore.updateLead(editingLead.id, {
      customerId,
      customerName: customer?.name || '',
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      value: Number(formData.get('value')),
      stage: formData.get('stage') as Lead['stage'],
      probability: Number(formData.get('probability')),
      expectedCloseDate: new Date(formData.get('expectedCloseDate') as string),
      assignedTo: formData.get('assignedTo') as string,
    });
    setLeads(dataStore.getLeads());
    setEditingLead(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect': return 'bg-gray-100 text-gray-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const LeadForm = ({ lead, onSubmit, onCancel }: {
    lead?: Lead;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {lead ? 'Edit Lead' : 'Add New Lead'}
        </h3>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="label">Customer</label>
            <select name="customerId" defaultValue={lead?.customerId} className="input" required>
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              type="text"
              defaultValue={lead?.title}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              defaultValue={lead?.description}
              className="input"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="label">Value ($)</label>
            <input
              name="value"
              type="number"
              defaultValue={lead?.value}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Stage</label>
            <select name="stage" defaultValue={lead?.stage} className="input" required>
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>
          <div>
            <label className="label">Probability (%)</label>
            <input
              name="probability"
              type="number"
              min="0"
              max="100"
              defaultValue={lead?.probability}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Expected Close Date</label>
            <input
              name="expectedCloseDate"
              type="date"
              defaultValue={lead?.expectedCloseDate.toISOString().split('T')[0]}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Assigned To</label>
            <input
              name="assignedTo"
              type="text"
              defaultValue={lead?.assignedTo}
              className="input"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1">
              {lead ? 'Update' : 'Add'} Lead
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
              <h1 className="text-3xl font-bold text-gray-900">Sales Leads</h1>
              <p className="text-gray-600">Track and manage your sales pipeline</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Stages</option>
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lead.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStageColor(lead.stage)}`}>
                      {lead.stage.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {lead.customerName}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${lead.value.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className={getProbabilityColor(lead.probability)}>
                      {lead.probability}% probability
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Expected: {lead.expectedCloseDate.toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-700 line-clamp-2">{lead.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Assigned to: {lead.assignedTo}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {lead.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No leads found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <LeadForm
          onSubmit={handleAddLead}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Lead Form */}
      {editingLead && (
        <LeadForm
          lead={editingLead}
          onSubmit={handleEditLead}
          onCancel={() => setEditingLead(null)}
        />
      )}
    </div>
  );
}