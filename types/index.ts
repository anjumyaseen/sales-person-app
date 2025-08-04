export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive' | 'prospect';
  createdAt: Date;
  lastContact: Date;
  totalValue: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl?: string;
}

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  value: number;
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: Date;
  validUntil: Date;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'follow-up';
  customerId: string;
  customerName: string;
  leadId?: string;
  description: string;
  date: Date;
  duration?: number;
  outcome: string;
  nextAction?: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalLeads: number;
  conversionRate: number;
  averageDealSize: number;
  salesByStage: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    leads: number;
  }>;
}