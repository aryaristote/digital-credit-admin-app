# UX Design Specifications & Prototypes

Complete design specifications for both Client and Admin applications, ready for Figma implementation.

---

## 🎨 Design System

### Color Palette

#### Primary Colors

- **Primary Blue**: `#2563EB` (Main actions, links, primary buttons)
- **Primary Dark**: `#1E40AF` (Hover states, active states)
- **Primary Light**: `#3B82F6` (Light backgrounds, accents)

#### Secondary Colors

- **Success Green**: `#10B981` (Success messages, completed states)
- **Warning Orange**: `#F59E0B` (Warnings, pending states)
- **Error Red**: `#EF4444` (Errors, rejected states)
- **Info Blue**: `#3B82F6` (Information messages)

#### Neutral Colors

- **Gray 900**: `#111827` (Primary text)
- **Gray 700**: `#374151` (Secondary text)
- **Gray 500**: `#6B7280` (Placeholder text)
- **Gray 300**: `#D1D5DB` (Borders, dividers)
- **Gray 100**: `#F3F4F6` (Backgrounds)
- **Gray 50**: `#F9FAFB` (Light backgrounds)
- **White**: `#FFFFFF` (Cards, modals)

### Typography

#### Font Family

- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'Fira Code', 'Courier New', monospace (for code/data)

#### Font Sizes

- **H1**: 32px / 40px line-height (Page titles)
- **H2**: 24px / 32px line-height (Section titles)
- **H3**: 20px / 28px line-height (Subsection titles)
- **Body Large**: 16px / 24px line-height (Body text)
- **Body**: 14px / 20px line-height (Default text)
- **Small**: 12px / 16px line-height (Labels, captions)

#### Font Weights

- **Bold**: 700 (Headings, emphasis)
- **Semibold**: 600 (Subheadings)
- **Medium**: 500 (Labels, buttons)
- **Regular**: 400 (Body text)

### Spacing Scale

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Component Library

#### Buttons

- **Primary Button**: Blue background, white text, 12px padding
- **Secondary Button**: White background, blue border, blue text
- **Danger Button**: Red background, white text
- **Ghost Button**: Transparent, text only

#### Cards

- White background, 1px border, 8px border-radius, 16px padding
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`

#### Input Fields

- Height: 40px
- Border: 1px solid gray-300
- Border-radius: 6px
- Padding: 0 12px
- Focus: Blue border, blue shadow

---

## 📱 Client Application Wireframes

### 1. Login Page

**Layout**:

```
┌─────────────────────────────────────┐
│                                     │
│        [Logo] Digital Credit        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign In                   │   │
│   │                            │   │
│   │  Email                     │   │
│   │  [________________]        │   │
│   │                            │   │
│   │  Password                  │   │
│   │  [________________]        │   │
│   │                            │   │
│   │  [Remember me]             │   │
│   │                            │   │
│   │  [Sign In Button]          │   │
│   │                            │   │
│   │  Forgot password?          │   │
│   │                            │   │
│   │  Don't have an account?    │   │
│   │  Sign up                   │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements**:

- Centered login card (max-width: 400px)
- Logo at top
- Email and password inputs
- "Remember me" checkbox
- Primary "Sign In" button
- Link to sign up

---

### 2. Dashboard

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Dashboard    [Notifications] [Profile] [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Savings      │  │ Credit Score │  │ Active Credit│ │
│  │ Balance      │  │              │  │              │ │
│  │ $12,450.00   │  │ 750          │  │ $5,000.00    │ │
│  │ [Deposit]    │  │ Good         │  │ [View Details]│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Recent Transactions                              │ │
│  │                                                  │ │
│  │  Date        Type        Amount      Balance    │ │
│  │  ────────────────────────────────────────────  │ │
│  │  Jan 15      Deposit     +$500       $12,450   │ │
│  │  Jan 10      Withdrawal  -$200       $11,950   │ │
│  │                                                  │ │
│  │  [View All Transactions]                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Quick Actions                                     │ │
│  │                                                  │ │
│  │  [Request Credit]  [Deposit]  [Withdraw]        │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Elements**:

- Top navigation bar with logo, notifications, profile
- Three summary cards: Savings Balance, Credit Score, Active Credit
- Recent transactions table
- Quick action buttons

---

### 3. Savings Account Page

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Back] Savings Account                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Account Overview                                  │ │
│  │                                                  │ │
│  │  Account Number: SAV123456789                    │ │
│  │  Current Balance: $12,450.00                    │ │
│  │  Interest Rate: 2.5%                             │ │
│  │                                                  │ │
│  │  [Deposit]  [Withdraw]                          │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Transaction History                              │ │
│  │                                                  │ │
│  │  [Filter: All ▼]  [Search]                      │ │
│  │                                                  │ │
│  │  Date        Type        Amount      Status     │ │
│  │  ────────────────────────────────────────────  │ │
│  │  Jan 15      Deposit     +$500       Completed │ │
│  │  Jan 10      Withdrawal  -$200       Completed │ │
│  │  Jan 05      Deposit     +$1,000     Completed │ │
│  │                                                  │ │
│  │  [< Previous]  Page 1 of 5  [Next >]          │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Credit Request Page

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Back] Request Credit                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Credit Request Form                              │ │
│  │                                                  │ │
│  │  Your Credit Score: 750 (Good)                  │ │
│  │                                                  │ │
│  │  Requested Amount                               │ │
│  │  [$___________] (Min: $1,000, Max: $100,000)   │ │
│  │                                                  │ │
│  │  Purpose                                        │ │
│  │  [Dropdown: Select purpose ▼]                  │ │
│  │    • Home Improvement                           │ │
│  │    • Business Expansion                        │ │
│  │    • Emergency Expenses                        │ │
│  │    • Other                                     │ │
│  │                                                  │ │
│  │  Description (Optional)                        │ │
│  │  [Text area...]                                │ │
│  │                                                  │ │
│  │  Estimated Interest Rate: 7.5%                 │ │
│  │  Estimated Monthly Payment: $XXX               │ │
│  │                                                  │ │
│  │  [Cancel]  [Submit Request]                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Credit Calculator                                │ │
│  │                                                  │ │
│  │  Amount: $10,000                                 │ │
│  │  Interest: 7.5%                                  │ │
│  │  Term: 12 months                                 │ │
│  │                                                  │ │
│  │  Monthly Payment: $888.88                       │ │
│  │  Total Amount: $10,666.56                       │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### 5. Credit Details Page

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Back] Credit Details                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Credit Overview                                  │ │
│  │                                                  │ │
│  │  Status: Active                                  │ │
│  │  Approved Amount: $10,000.00                     │ │
│  │  Interest Rate: 7.5%                             │ │
│  │  Term: 12 months                                 │ │
│  │  Remaining Balance: $6,000.00                    │ │
│  │                                                  │ │
│  │  [Make Payment]                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Payment Schedule                                 │ │
│  │                                                  │ │
│  │  Month  Payment     Principal  Interest  Status │ │
│  │  ────────────────────────────────────────────  │ │
│  │  1      $888.88    $826.88    $62.00   Paid   │ │
│  │  2      $888.88    $833.08    $55.80   Paid   │ │
│  │  3      $888.88    $839.32    $49.56   Due    │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Payment History                                  │ │
│  │                                                  │ │
│  │  Date        Amount      Status                  │ │
│  │  ────────────────────────────────────────────  │ │
│  │  Jan 15      $888.88     Completed              │ │
│  │  Dec 15      $888.88     Completed              │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ Admin Application Wireframes

### 1. Admin Login Page

**Layout**:

```
┌─────────────────────────────────────┐
│                                     │
│        [Logo] Admin Portal          │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Admin Sign In               │   │
│   │                              │   │
│   │  Email                       │   │
│   │  [________________]          │   │
│   │                              │   │
│   │  Password                    │   │
│   │  [________________]          │   │
│   │                              │   │
│   │  [Sign In]                   │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

### 2. Admin Dashboard

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Admin Dashboard  [Notifications] [Profile] [Logout]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Total Users  │  │ Pending      │  │ Total        │ │
│  │              │  │ Credits      │  │ Savings      │ │
│  │ 1,234        │  │              │  │              │ │
│  │ ↑ 12%        │  │ 45           │  │ $2.5M        │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Active       │  │ Total        │  │ Completed    │ │
│  │ Credits      │  │ Transactions │  │ Credits      │ │
│  │              │  │              │  │              │ │
│  │ 234          │  │ 5,678        │  │ 890          │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Recent Activity                                  │ │
│  │                                                  │ │
│  │  Time      User           Action        Status  │ │
│  │  ────────────────────────────────────────────  │ │
│  │  10:30    John Doe        Credit Request Pending│ │
│  │  10:25    Jane Smith      Credit Approved Done │ │
│  │  10:20    Test User       Deposit       Done   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Quick Actions                                     │ │
│  │                                                  │ │
│  │  [Review Credits]  [View Users]  [Analytics]    │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Credit Approvals Page

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Back] Credit Approvals                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Filter: All ▼]  [Status: Pending ▼]  [Search...]   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Credit Requests                                  │ │
│  │                                                  │ │
│  │  [Select All]  [Bulk Approve]  [Bulk Reject]   │ │
│  │                                                  │ │
│  │  ☐ Name          Amount    Score  Date    Status│ │
│  │  ────────────────────────────────────────────  │ │
│  │  ☐ John Doe      $10,000   750   Jan 15  Pending│ │
│  │  ☐ Jane Smith    $5,000    680   Jan 14  Pending│ │
│  │  ☐ Test User     $15,000   720   Jan 13  Pending│ │
│  │                                                  │ │
│  │  [< Previous]  Page 1 of 10  [Next >]         │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Credit Approval Detail Modal

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ Credit Request Details                            [×]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Information                                       │
│  ───────────────────                                    │
│  Name: John Doe                                         │
│  Email: john.doe@example.com                            │
│  Credit Score: 750 (Good)                              │
│                                                         │
│  Request Details                                        │
│  ───────────────────                                    │
│  Requested Amount: $10,000.00                          │
│  Purpose: Home Improvement                            │
│  Description: Need funds for kitchen renovation        │
│  Date: January 15, 2024                                │
│                                                         │
│  Approval Options                                       │
│  ───────────────────                                    │
│  Approved Amount:                                       │
│  [$___________] (Cannot exceed requested amount)      │
│                                                         │
│  Reason (if rejecting):                                │
│  [Text area...]                                        │
│                                                         │
│  [Reject]                    [Approve]                 │
└─────────────────────────────────────────────────────────┘
```

---

### 5. Users Management Page

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│ [Back] Users Management                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search...]  [Filter: Active ▼]  [Export]            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Users List                                        │ │
│  │                                                  │ │
│  │  Name      Email          Score  Status  Actions │ │
│  │  ────────────────────────────────────────────  │ │
│  │  John Doe  john@...        750  Active  [View] │ │
│  │  Jane S.   jane@...        680  Active  [View] │ │
│  │  Test U.   test@...        720  Active  [View] │ │
│  │                                                  │ │
│  │  [< Previous]  Page 1 of 50  [Next >]         │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📐 Component Specifications

### Cards

- **Background**: White (#FFFFFF)
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Padding**: 16px
- **Shadow**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Spacing**: 16px margin between cards

### Tables

- **Header Background**: #F9FAFB
- **Header Text**: Semibold, 14px
- **Row Height**: 48px
- **Border**: 1px solid #E5E7EB between rows
- **Hover**: #F9FAFB background
- **Padding**: 12px horizontal, 8px vertical

### Forms

- **Input Height**: 40px
- **Input Padding**: 0 12px
- **Border**: 1px solid #D1D5DB
- **Border Radius**: 6px
- **Focus Border**: 2px solid #2563EB
- **Label**: 14px, semibold, #374151
- **Error Text**: 12px, #EF4444

### Buttons

- **Primary**: Blue background (#2563EB), white text, 12px padding
- **Secondary**: White background, blue border, blue text
- **Height**: 40px
- **Border Radius**: 6px
- **Font**: 14px, medium weight

---

## 🎯 User Flows

### Client App Flow

1. **Login** → Dashboard
2. **Dashboard** → Savings/Credit/Profile
3. **Savings** → Deposit/Withdraw → Confirmation
4. **Credit** → Request → Review → Submit
5. **Credit Details** → Make Payment → Confirmation

### Admin App Flow

1. **Login** → Dashboard
2. **Dashboard** → Credit Approvals/Users/Analytics
3. **Credit Approvals** → Review → Approve/Reject
4. **Users** → View Details → Edit/Deactivate
5. **Analytics** → View Reports → Export

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🎨 Design Principles

1. **Clarity**: Clean, uncluttered interfaces
2. **Consistency**: Same components across pages
3. **Feedback**: Clear success/error states
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Fast loading, smooth interactions

---

## 📚 Next Steps for Figma

1. Create color styles from the palette above
2. Set up text styles for typography
3. Build component library with specifications
4. Create page layouts using wireframes
5. Add interactions and prototypes
6. Test responsiveness at breakpoints

---

This document provides all specifications needed to create high-fidelity Figma designs!
