import { Customer, Product, Lead, Quote, SalesActivity, SalesMetrics } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demonstration
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc.',
    address: '123 Business Ave, San Francisco, CA 94105',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastContact: new Date('2024-07-10'),
    totalValue: 125000,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovate.com',
    phone: '+1-555-0456',
    company: 'Innovate Solutions',
    address: '456 Innovation Blvd, Austin, TX 78701',
    status: 'prospect',
    createdAt: new Date('2024-03-20'),
    lastContact: new Date('2024-07-15'),
    totalValue: 75000,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@globaltech.com',
    phone: '+1-555-0789',
    company: 'Global Tech Systems',
    address: '789 Enterprise Way, Seattle, WA 98101',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    lastContact: new Date('2024-07-18'),
    totalValue: 200000,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Enterprise CRM Software',
    description: 'Comprehensive customer relationship management solution',
    price: 299,
    category: 'Software',
    inStock: true,
  },
  {
    id: '2',
    name: 'Sales Analytics Dashboard',
    description: 'Advanced analytics and reporting for sales teams',
    price: 199,
    category: 'Software',
    inStock: true,
  },
  {
    id: '3',
    name: 'Marketing Automation Suite',
    description: 'Complete marketing automation and lead nurturing platform',
    price: 399,
    category: 'Software',
    inStock: true,
  },
  {
    id: '4',
    name: 'Professional Services Package',
    description: 'Implementation and training services',
    price: 150,
    category: 'Services',
    inStock: true,
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Smith',
    title: 'Enterprise CRM Implementation',
    description: 'TechCorp is looking to upgrade their current CRM system',
    value: 50000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: new Date('2024-08-15'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-07-15'),
    assignedTo: 'Sales Rep 1',
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Sarah Johnson',
    title: 'Marketing Automation Setup',
    description: 'Innovate Solutions needs marketing automation for lead generation',
    value: 25000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: new Date('2024-09-01'),
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-18'),
    assignedTo: 'Sales Rep 2',
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Michael Chen',
    title: 'Complete Sales Suite',
    description: 'Global Tech wants a comprehensive sales and marketing solution',
    value: 100000,
    stage: 'negotiation',
    probability: 85,
    expectedCloseDate: new Date('2024-07-30'),
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-19'),
    assignedTo: 'Sales Rep 1',
  },
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Smith',
    items: [
      {
        productId: '1',
        productName: 'Enterprise CRM Software',
        quantity: 50,
        unitPrice: 299,
        total: 14950,
      },
      {
        productId: '4',
        productName: 'Professional Services Package',
        quantity: 100,
        unitPrice: 150,
        total: 15000,
      },
    ],
    subtotal: 29950,
    tax: 2995,
    total: 32945,
    status: 'sent',
    createdAt: new Date('2024-07-10'),
    validUntil: new Date('2024-08-10'),
  },
];

export const mockActivities: SalesActivity[] = [
  {
    id: '1',
    type: 'call',
    customerId: '1',
    customerName: 'John Smith',
    leadId: '1',
    description: 'Initial discovery call to understand requirements',
    date: new Date('2024-07-15'),
    duration: 45,
    outcome: 'Positive - customer interested in enterprise solution',
    nextAction: 'Send proposal by end of week',
  },
  {
    id: '2',
    type: 'email',
    customerId: '2',
    customerName: 'Sarah Johnson',
    leadId: '2',
    description: 'Follow-up email with product demo recording',
    date: new Date('2024-07-18'),
    outcome: 'Email opened and demo viewed',
    nextAction: 'Schedule follow-up call',
  },
  {
    id: '3',
    type: 'meeting',
    customerId: '3',
    customerName: 'Michael Chen',
    leadId: '3',
    description: 'Contract negotiation meeting',
    date: new Date('2024-07-19'),
    duration: 90,
    outcome: 'Agreement on pricing, pending legal review',
    nextAction: 'Wait for legal approval',
  },
];

export const mockMetrics: SalesMetrics = {
  totalRevenue: 400000,
  monthlyRevenue: 75000,
  totalLeads: 15,
  conversionRate: 0.65,
  averageDealSize: 58333,
  salesByStage: {
    prospect: 3,
    qualified: 4,
    proposal: 3,
    negotiation: 2,
    'closed-won': 2,
    'closed-lost': 1,
  },
  monthlyTrend: [
    { month: 'Jan', revenue: 45000, leads: 8 },
    { month: 'Feb', revenue: 52000, leads: 12 },
    { month: 'Mar', revenue: 48000, leads: 10 },
    { month: 'Apr', revenue: 65000, leads: 15 },
    { month: 'May', revenue: 58000, leads: 11 },
    { month: 'Jun', revenue: 72000, leads: 18 },
    { month: 'Jul', revenue: 75000, leads: 20 },
  ],
};

// Data management functions
class DataStore {
  private customers: Customer[] = [...mockCustomers];
  private products: Product[] = [...mockProducts];
  private leads: Lead[] = [...mockLeads];
  private quotes: Quote[] = [...mockQuotes];
  private activities: SalesActivity[] = [...mockActivities];

  // Customer methods
  getCustomers(): Customer[] {
    return this.customers;
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.customers.splice(index, 1);
    return true;
  }

  // Product methods
  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Lead methods
  getLeads(): Lead[] {
    return this.leads;
  }

  getLead(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    this.leads[index] = { 
      ...this.leads[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.leads[index];
  }

  // Quote methods
  getQuotes(): Quote[] {
    return this.quotes;
  }

  addQuote(quote: Omit<Quote, 'id' | 'createdAt'>): Quote {
    const newQuote: Quote = {
      ...quote,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.quotes.push(newQuote);
    return newQuote;
  }

  // Activity methods
  getActivities(): SalesActivity[] {
    return this.activities;
  }

  addActivity(activity: Omit<SalesActivity, 'id'>): SalesActivity {
    const newActivity: SalesActivity = {
      ...activity,
      id: uuidv4(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  // Metrics
  getMetrics(): SalesMetrics {
    return mockMetrics;
  }
}

export const dataStore = new DataStore();