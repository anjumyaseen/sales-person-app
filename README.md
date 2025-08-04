# Sales Person App

A comprehensive sales management application built with Next.js, TypeScript, and Tailwind CSS. This application serves as a complete CRM and sales management solution for sales professionals.

## Features

### 🏠 Dashboard
- **Key Metrics**: Total revenue, monthly revenue, leads count, and conversion rates
- **Revenue Trend Chart**: Visual representation of monthly revenue trends
- **Sales Pipeline**: Pie chart showing distribution of leads across different stages
- **Recent Activities**: Timeline of recent sales activities
- **Upcoming Tasks**: Task management with priority indicators

### 👥 Customer Management
- **Customer Database**: Complete customer information management
- **Contact Details**: Store names, emails, phones, companies, and addresses
- **Status Tracking**: Track customer status (Active, Inactive, Prospect)
- **Search & Filter**: Easy search and filtering capabilities
- **Customer Value**: Track total value per customer

### 🎯 Lead Management
- **Sales Pipeline**: Track leads through different stages
  - Prospect
  - Qualified
  - Proposal
  - Negotiation
  - Closed Won
  - Closed Lost
- **Lead Details**: Title, description, value, probability, and expected close date
- **Assignment**: Assign leads to sales representatives
- **Progress Tracking**: Monitor lead progression and updates

### 📦 Product Catalog
- **Product Management**: Maintain comprehensive product catalog
- **Pricing**: Track product prices and categories
- **Inventory Status**: Monitor stock availability
- **Product Details**: Descriptions, categories, and optional images

### 📄 Quote Management
- **Quote Creation**: Generate professional quotes for customers
- **Multi-Product Quotes**: Add multiple products with quantities
- **Automatic Calculations**: Subtotal, tax, and total calculations
- **Quote Status**: Track quote status (Draft, Sent, Accepted, Rejected)
- **Quote Viewer**: Professional quote display with PDF export capability

### 📊 Activity Tracking
- **Activity Logging**: Record all sales activities
- **Activity Types**: Calls, emails, meetings, demos, follow-ups
- **Customer Association**: Link activities to customers and leads
- **Outcome Tracking**: Record outcomes and next actions
- **Timeline View**: Chronological activity timeline

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React hooks with local state
- **Data Storage**: In-memory data store (can be extended to use databases)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-person-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:12000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
sales-person-app/
├── app/                    # Next.js app directory
│   ├── customers/         # Customer management page
│   ├── leads/            # Lead management page
│   ├── products/         # Product catalog page
│   ├── quotes/           # Quote management page
│   ├── activities/       # Activity tracking page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/            # Reusable components
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── DashboardCard.tsx # Dashboard metric cards
├── lib/                  # Utility libraries
│   └── data.ts          # Data management and mock data
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
└── public/              # Static assets
```

## Data Models

### Customer
- ID, name, email, phone, company, address
- Status (active, inactive, prospect)
- Creation date, last contact date, total value

### Lead
- ID, customer association, title, description
- Value, stage, probability, expected close date
- Assignment, creation/update dates

### Product
- ID, name, description, price, category
- Stock status, optional image URL

### Quote
- ID, customer association, line items
- Subtotal, tax, total, status
- Creation date, validity period

### Activity
- ID, type, customer/lead association
- Description, date, duration, outcome
- Next action items

## Features in Detail

### Dashboard Analytics
- Real-time metrics calculation
- Interactive charts with hover details
- Color-coded status indicators
- Responsive design for all screen sizes

### Customer Relationship Management
- Complete customer lifecycle management
- Advanced search and filtering
- Customer value tracking
- Contact history

### Sales Pipeline Management
- Visual pipeline representation
- Drag-and-drop functionality (can be extended)
- Probability-based forecasting
- Stage-specific actions

### Quote Generation
- Professional quote templates
- Multi-product line items
- Automatic tax calculations
- PDF export capability (ready for implementation)

### Activity Management
- Comprehensive activity logging
- Customer and lead associations
- Outcome tracking
- Follow-up reminders

## Customization

The application is designed to be easily customizable:

1. **Data Storage**: Replace the in-memory data store with a database
2. **Authentication**: Add user authentication and authorization
3. **Email Integration**: Connect with email services for quote sending
4. **PDF Generation**: Implement PDF generation for quotes
5. **Reporting**: Add advanced reporting and analytics
6. **Integrations**: Connect with external CRM systems or APIs

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.