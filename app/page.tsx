'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import { dataStore } from '@/lib/data';
import { SalesMetrics } from '@/types';
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  UserPlus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    setMetrics(dataStore.getMetrics());
    setRecentActivities(dataStore.getActivities().slice(0, 5));
    
    // Mock upcoming tasks
    setUpcomingTasks([
      {
        id: '1',
        title: 'Follow up with John Smith',
        type: 'call',
        dueDate: new Date('2024-07-20'),
        priority: 'high',
      },
      {
        id: '2',
        title: 'Send proposal to Sarah Johnson',
        type: 'email',
        dueDate: new Date('2024-07-21'),
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Demo for Global Tech Systems',
        type: 'meeting',
        dueDate: new Date('2024-07-22'),
        priority: 'high',
      },
    ]);
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  const salesByStageData = Object.entries(metrics.salesByStage).map(([stage, count]) => ({
    name: stage.replace('-', ' ').toUpperCase(),
    value: count,
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      default: return UserPlus;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your sales overview.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              change="+12% from last month"
              changeType="positive"
            />
            <DashboardCard
              title="Monthly Revenue"
              value={`$${metrics.monthlyRevenue.toLocaleString()}`}
              icon={TrendingUp}
              change="+8% from last month"
              changeType="positive"
            />
            <DashboardCard
              title="Total Leads"
              value={metrics.totalLeads}
              icon={Target}
              change="+5 new this week"
              changeType="positive"
            />
            <DashboardCard
              title="Conversion Rate"
              value={`${(metrics.conversionRate * 100).toFixed(1)}%`}
              icon={Users}
              change="+2.1% from last month"
              changeType="positive"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Stage */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByStageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities and Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <IconComponent className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.customerName} • {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                {upcomingTasks.map((task) => {
                  const IconComponent = getActivityIcon(task.type);
                  return (
                    <div key={task.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Due: {task.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}