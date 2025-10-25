# Admin Dashboard Frontend

Professional admin dashboard for the Digital Credit & Savings Platform.

## Features

- 🔐 Admin Authentication
- 📊 Dashboard with Analytics
- 👥 User Management (View, Activate/Deactivate)
- ✅ Credit Approval System (Approve/Reject)
- 💰 Transaction Monitoring
- 📈 Analytics & Reports
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast Development with Vite
- 📱 Responsive Design

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State Management
- **Axios** - HTTP Client
- **React Hook Form** - Form Management
- **Recharts** - Data Visualization
- **Lucide React** - Icons
- **Sonner** - Toast Notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3002`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5174`

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Top navigation bar
│   │   ├── Sidebar.tsx        # Side navigation menu
│   │   └── Layout.tsx         # Main layout wrapper
│   └── ui/
│       ├── Button.tsx         # Reusable button component
│       ├── Card.tsx           # Card component
│       └── Input.tsx          # Input component
├── pages/
│   ├── auth/
│   │   └── Login.tsx          # Admin login page
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Users.tsx              # User management
│   ├── CreditApprovals.tsx    # Credit approval system
│   ├── Transactions.tsx       # Transaction monitoring
│   └── Analytics.tsx          # Analytics & reports
├── lib/
│   ├── api.ts                 # Axios instance & interceptors
│   └── utils.ts               # Utility functions
├── store/
│   └── authStore.ts           # Authentication state
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles

## Available Routes

- `/login` - Admin login
- `/` - Dashboard overview
- `/users` - User management
- `/credit-approvals` - Credit approval dashboard
- `/transactions` - Transaction monitoring
- `/analytics` - Analytics & reports

## Environment Variables

The app proxies API requests to `http://localhost:3002/api/v1` (configured in `vite.config.ts`).

To change the backend URL, update `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:port',
      changeOrigin: true,
    },
  },
}
```

## Key Features

### 1. Authentication
- Secure admin login with JWT
- Token refresh mechanism
- Protected routes
- Persistent session storage

### 2. Dashboard
- Real-time statistics
- System status monitoring
- Quick access to key metrics

### 3. User Management
- View all registered users
- Search and filter users
- Activate/deactivate users
- View credit scores

### 4. Credit Approvals
- Review pending credit requests
- Approve or reject requests
- View customer credit scores
- Filter by status

### 5. Transaction Monitoring
- View all system transactions
- Filter by transaction type
- Export capabilities
- Detailed transaction information

### 6. Analytics
- Performance metrics
- Credit distribution charts
- Monthly disbursement tracking
- Key performance indicators

## Development

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`

### API Integration

All API calls should use the configured axios instance from `src/lib/api.ts`:

```typescript
import api from '../lib/api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Docker Support

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## License

Part of the Digital Credit & Savings Platform

