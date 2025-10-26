# Client Frontend Setup Guide

Complete setup guide for the Client Application Frontend.

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Client Backend** running on `http://localhost:3001`
- **PostgreSQL** database running
- **Redis** running (for notifications queue)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd client-app/frontend
npm install
```

### 2. Configure Backend URL

The frontend proxies API requests to the backend. Default configuration points to `http://localhost:3001/api/v1`.

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

Or create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Register/Login

- Navigate to `http://localhost:3000/register` to create an account
- Or login at `http://localhost:3000/login` if you already have an account

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
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   └── ui/             # UI primitives (Button, Input, Card)
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages (Login, Register)
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Savings.tsx     # Savings management
│   │   ├── Credit.tsx      # Credit management
│   │   ├── CreditRequest.tsx  # Credit request form
│   │   ├── Profile.tsx     # User profile
│   │   └── Notifications.tsx  # Notifications center
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

Create a `.env` file for custom configuration:

```env
VITE_API_URL=http://localhost:3001/api/v1
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

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post("/api/v1/auth/refresh", {
            refreshToken,
          });
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios.request(error.config);
        } catch {
          // Refresh failed, logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🎨 Styling

The application uses **Tailwind CSS** for styling. Customize colors and theme in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        secondary: "#64748b",
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

1. User registers/logs in via `/register` or `/login`
2. Backend returns JWT access token and refresh token
3. Tokens are stored in localStorage via Zustand persist
4. Access token is included in all API requests
5. On 401 error, refresh token is used to get new access token
6. If refresh fails, user is redirected to login
7. Protected routes check authentication state

### Auth Store

Authentication state is managed with Zustand in `src/store/authStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    { name: "auth-storage" }
  )
);
```

---

## 📱 Routes

### Available Routes

- `/login` - User login page
- `/register` - User registration page
- `/` - Dashboard overview
- `/savings` - Savings account management
- `/credit` - Credit management
- `/credit-request` - Submit credit request
- `/profile` - User profile settings
- `/notifications` - Notifications center

### Route Protection

Routes are protected in `src/App.tsx`:

```typescript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Dashboard />} />
  <Route path="/savings" element={<Savings />} />
  <Route path="/credit" element={<Credit />} />
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

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**

1. Ensure backend is running on `http://localhost:3001`
2. Check CORS configuration in backend
3. Verify proxy settings in `vite.config.ts`
4. Check browser console for CORS errors

### Issue: Login redirects immediately

**Solution:**

1. Check browser console for errors
2. Verify backend is returning valid JWT tokens
3. Check network tab for API responses
4. Verify token storage in localStorage

### Issue: Token refresh not working

**Solution:**

1. Check refresh token is stored correctly
2. Verify backend refresh endpoint is working
3. Check axios interceptor logic in `lib/api.ts`
4. Ensure refresh token hasn't expired (7 days default)

### Issue: Build fails

**Solution:**

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check for TypeScript errors: `npm run type-check`
4. Verify all environment variables are set

### Issue: Styling not working

**Solution:**

1. Ensure Tailwind CSS is properly configured
2. Check `tailwind.config.js` content paths
3. Verify `index.css` imports Tailwind directives
4. Restart dev server after Tailwind config changes

---

## 📚 Dependencies

### Key Dependencies

- **react** ^18.2.0 - UI library
- **react-router-dom** ^6.x - Routing
- **zustand** ^4.x - State management
- **axios** ^1.x - HTTP client
- **tailwindcss** ^3.x - CSS framework
- **react-hook-form** - Form management
- **lucide-react** - Icons
- **sonner** - Toast notifications
- **date-fns** - Date formatting

---

## 💡 Features

### 1. Savings Management

- Create savings account
- Deposit and withdraw funds
- View transaction history
- Real-time balance updates

### 2. Credit Management

- Submit credit requests
- View credit request status
- Track repayment progress
- Make repayments

### 3. Profile Management

- Update personal information
- View account statistics
- Credit score tracking

### 4. Notifications

- In-app notifications
- Real-time updates
- Mark as read/unread
- Notification history

---

## 🔗 Related Documentation

- **Backend API**: See `../backend/API_DOCUMENTATION.md`
- **Backend README**: See `../backend/README.md`
- **Client App README**: See `../README.md`

---

## 💡 Tips

1. **Hot Reload**: Vite provides instant hot module replacement
2. **State Management**: Use Zustand for global state, React hooks for local state
3. **API Calls**: Always use the centralized API client from `lib/api.ts`
4. **Error Handling**: Implement proper error boundaries and toast notifications
5. **Performance**: Use React.memo for expensive components, lazy loading for routes
6. **Forms**: Use React Hook Form for form management and validation
7. **Responsive Design**: Test on mobile, tablet, and desktop viewports

---

**Last Updated**: 2024-01-15
