# Digital Credit & Savings Platform - Client Frontend

A modern, responsive React application for customers to manage their finances, including savings accounts and credit requests.

## 🚀 Features

- **Authentication**

  - Secure login and registration
  - JWT-based authentication with refresh tokens
  - Protected routes and session management

- **Dashboard**

  - Overview of account balance, credit score, and active credits
  - Quick access to key features
  - Real-time statistics

- **Savings Management**

  - Create savings accounts
  - Deposit and withdraw funds
  - View transaction history
  - Real-time balance updates

- **Credit Management**

  - Request credit with custom terms
  - View credit request status
  - Track repayment progress
  - Automatic approval/rejection based on credit score

- **Profile Management**

  - Update personal information
  - View account statistics
  - Credit score tracking

- **Notifications**
  - In-app notifications
  - Real-time updates
  - Mark as read/unread functionality

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **UI Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:3001

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build

Create a production build:

```bash
npm run build
```

### 4. Preview

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── layout/       # Layout components (Sidebar, Header)
│   │   └── ui/           # UI primitives (Button, Input, Card)
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── Dashboard.tsx
│   │   ├── Savings.tsx
│   │   ├── Credit.tsx
│   │   ├── Profile.tsx
│   │   └── Notifications.tsx
│   ├── store/            # Zustand stores
│   ├── lib/              # Utilities and API client
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── index.html           # HTML template
```

## 🎨 Design System

The application uses a consistent design system with:

- **Primary Color**: Blue (#0ea5e9)
- **Typography**: System fonts with Tailwind's default font stack
- **Spacing**: 4px base unit (Tailwind's spacing scale)
- **Border Radius**: Rounded corners (8px for cards, 6px for buttons)
- **Shadows**: Subtle shadows for depth

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT access token and refresh token
3. Tokens are stored in localStorage via Zustand persist
4. Access token is included in all API requests
5. On 401 error, refresh token is used to get new access token
6. If refresh fails, user is redirected to login

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

Run type checking:

```bash
npm run type-check
```

Run linter:

```bash
npm run lint
```

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Docker

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

## 🔧 Configuration

### Environment Variables

Create a `.env` file (if needed):

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 📝 Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Styling**: Use Tailwind CSS utility classes
3. **State Management**: Use Zustand for global state, React hooks for local state
4. **Forms**: Use React Hook Form for form handling and validation
5. **API Calls**: Use the centralized API client in `lib/api.ts`
6. **TypeScript**: Define interfaces for all data structures
7. **Code Style**: Follow ESLint and Prettier rules

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
