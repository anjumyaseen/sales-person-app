'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { dataStore } from '@/lib/data';
import { SalesActivity, Customer, Lead } from '@/types';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  Users,
  Monitor,
  Clock,
  User,
  Target,
} from 'lucide-react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setActivities(dataStore.getActivities());
    setCustomers(dataStore.getCustomers());
    setLeads(dataStore.getLeads());
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddActivity = (formData: FormData) => {
    const customerId = formData.get('customerId') as string;
    const customer = customers.find(c => c.id === customerId);
    const leadId = formData.get('leadId') as string || undefined;
    
    const newActivity = dataStore.addActivity({
      type: formData.get('type') as SalesActivity['type'],
      customerId,
      customerName: customer?.name || '',
      leadId,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string),
      duration: formData.get('duration') ? Number(formData.get('duration')) : undefined,
      outcome: formData.get('outcome') as string,
      nextAction: formData.get('nextAction') as string || undefined,
    });
    setActivities(dataStore.getActivities());
    setShowAddForm(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'demo': return Monitor;
      case 'follow-up': return Users;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'demo': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ActivityForm = ({ onSubmit, onCancel }: {
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Log New Activity</h3>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="label">Activity Type</label>
            <select name="type" className="input" required>
              <option value="call">Phone Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="demo">Demo</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
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
            <label className="label">Related Lead (optional)</label>
            <select name="leadId" className="input">
              <option value="">No related lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.title}
                </option>
              ))}
            </select>
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
            <label className="label">Date & Time</label>
            <input
              name="date"
              type="datetime-local"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Duration (minutes, optional)</label>
            <input
              name="duration"
              type="number"
              min="1"
              className="input"
            />
          </div>
          <div>
            <label className="label">Outcome</label>
            <textarea
              name="outcome"
              className="input"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="label">Next Action (optional)</label>
            <input
              name="nextAction"
              type="text"
              className="input"
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1">
              Log Activity
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
              <h1 className="text-3xl font-bold text-gray-900">Sales Activities</h1>
              <p className="text-gray-600">Track all your sales interactions</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Types</option>
              <option value="call">Phone Calls</option>
              <option value="email">Emails</option>
              <option value="meeting">Meetings</option>
              <option value="demo">Demos</option>
              <option value="follow-up">Follow-ups</option>
            </select>
          </div>

          {/* Activities Timeline */}
          <div className="space-y-6">
            {filteredActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <IconComponent className="h-5 w-5 text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.description}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}>
                            {activity.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {activity.customerName}
                        </div>
                        {activity.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {activity.duration} minutes
                          </div>
                        )}
                        {activity.leadId && (
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            Related to lead
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Outcome:</h4>
                          <p className="text-gray-700">{activity.outcome}</p>
                        </div>
                        
                        {activity.nextAction && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Next Action:</h4>
                            <p className="text-gray-700">{activity.nextAction}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activities found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Form */}
      {showAddForm && (
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}