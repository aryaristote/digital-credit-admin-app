# Admin Frontend Setup Guide

Complete setup guide for the Admin Dashboard Frontend application.

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Admin Backend** running on `http://localhost:3002`
- **PostgreSQL** database with admin user created

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd admin-app/frontend
npm install
```

### 2. Configure Backend URL

The frontend is configured to proxy API requests to the backend. The default configuration points to `http://localhost:3002/api/v1`.

To change the backend URL, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:port',
      changeOrigin: true,
    },
  },
},
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### 4. Login

- Navigate to `http://localhost:5174/login`
- Use admin credentials:
  - **Email**: `admin@digitalcredit.com`
  - **Password**: `Admin@123456`

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── ui/             # UI primitives (Button, Input, Card)
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Users.tsx       # User management
│   │   ├── CreditApprovals.tsx  # Credit approval system
│   │   ├── Transactions.tsx      # Transaction monitoring
│   │   └── Analytics.tsx         # Analytics & reports
│   ├── lib/                # Utilities
│   │   ├── api.ts          # Axios instance & interceptors
│   │   └── utils.ts        # Helper functions
│   ├── store/              # State management
│   │   └── authStore.ts    # Authentication state
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file if you need to customize backend URL:

```env
VITE_API_URL=http://localhost:3002/api/v1
```

### API Configuration

The API client is configured in `src/lib/api.ts`:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // Uses Vite proxy
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🎨 Styling

The application uses **Tailwind CSS** for styling. The configuration is in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        // Add custom colors here
      },
    },
  },
  plugins: [],
};
```

---

## 🔐 Authentication

### Auth Flow

1. User logs in via `/login` page
2. Backend returns JWT access token
3. Token is stored in localStorage via Zustand persist
4. Token is included in all API requests via axios interceptor
5. On 401 error, user is redirected to login
6. Protected routes check authentication state

### Auth Store

The authentication state is managed with Zustand in `src/store/authStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (token, user) =>
        set({ accessToken: token, user, isAuthenticated: true }),
      logout: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);
```

---

## 📱 Routes

### Available Routes

- `/login` - Admin login page
- `/` - Dashboard overview
- `/users` - User management
- `/credit-approvals` - Credit approval dashboard
- `/transactions` - Transaction monitoring
- `/analytics` - Analytics & reports

### Route Protection

Routes are protected in `src/App.tsx`:

```typescript
<Route path="/login" element={<Login />} />
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Dashboard />} />
  <Route path="/users" element={<Users />} />
  {/* ... other protected routes */}
</Route>
```

---

## 🧪 Testing

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

---

## 🚀 Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**

1. Ensure backend is running on `http://localhost:3002`
2. Check CORS configuration in backend
3. Verify proxy settings in `vite.config.ts`

### Issue: Login redirects immediately

**Solution:**

1. Check browser console for errors
2. Verify backend is returning valid JWT token
3. Check network tab for API responses

### Issue: Build fails

**Solution:**

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check for TypeScript errors: `npm run type-check`

### Issue: Styling not working

**Solution:**

1. Ensure Tailwind CSS is properly configured
2. Check `tailwind.config.js` content paths
3. Verify `index.css` imports Tailwind directives

---

## 📚 Dependencies

### Key Dependencies

- **react** ^18.2.0 - UI library
- **react-router-dom** ^6.x - Routing
- **zustand** ^4.x - State management
- **axios** ^1.x - HTTP client
- **tailwindcss** ^3.x - CSS framework
- **recharts** ^2.x - Charts
- **lucide-react** - Icons
- **sonner** - Toast notifications

---

## 🔗 Related Documentation

- **Backend API**: See `../backend/API_DOCUMENTATION.md`
- **Backend Setup**: See `../backend/ADMIN_SETUP_GUIDE.md`
- **Backend README**: See `../backend/README.md`

---

## 💡 Tips

1. **Hot Reload**: Vite provides instant hot module replacement during development
2. **State Management**: Use Zustand for global state, React hooks for local state
3. **API Calls**: Always use the centralized API client from `lib/api.ts`
4. **Error Handling**: Implement proper error boundaries and toast notifications
5. **Performance**: Use React.memo for expensive components, lazy loading for routes

---

**Last Updated**: 2024-01-15
