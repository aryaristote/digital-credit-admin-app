# Admin Backend Security Guide

Detailed security documentation for the Admin Application Backend.

---

## 🔐 Authentication Security

### Admin-Only Access

**Security Requirements:**

- ✅ Only users with `role='admin'` can access
- ✅ Separate JWT secret from client app
- ✅ Admin guard on all endpoints
- ✅ Account status verification

**Login Validation:**

```typescript
// Verify admin role
if (user.role !== UserRole.ADMIN) {
  throw new UnauthorizedException("Admin access required");
}

// Verify account is active
if (!user.isActive) {
  throw new UnauthorizedException("Account deactivated");
}
```

### Password Security

**Same as Client App:**

- bcrypt hashing (10 rounds)
- Secure password comparison
- Password excluded from responses

---

## 🛡️ Authorization

### Admin Guards

**All Endpoints Protected:**

```typescript
@UseGuards(AuthGuard("jwt"), AdminGuard)
@ApiBearerAuth("JWT-auth")
export class UsersController {
  // All methods require admin authentication
}
```

**Admin Guard Implementation:**

```typescript
canActivate(context: ExecutionContext): boolean {
  const user = context.switchToHttp().getRequest().user;
  return user && user.role === 'admin';
}
```

---

## 🔒 Data Protection

### Elevated Permissions

**Admin Capabilities:**

- View all users
- Modify user accounts
- Approve/reject credits
- Access analytics
- View all transactions

**Security Measures:**

- ✅ Role verification on every request
- ✅ Admin activity logging (recommended)
- ✅ Audit trail for critical actions
- ✅ Limited admin account creation

---

## 🚨 Security Best Practices

### Admin Account Management

**Creation:**

- Manual creation only (no public registration)
- Strong password requirements
- Password change on first login (recommended)

**Account Security:**

```typescript
// Admin user creation script
const hashedPassword = await bcrypt.hash("Admin@123456", 10);
// Password should be changed after first login
```

### Separate JWT Secret

**Important:**

```env
# Admin app uses separate JWT secret
JWT_SECRET=admin-specific-jwt-secret-different-from-client
```

---

## 📊 Security Checklist

- [x] Admin-only access control
- [x] Separate JWT secret
- [x] Admin guard on all endpoints
- [x] Password hashing
- [x] Role verification
- [x] Account status checks
- [x] Input validation
- [x] SQL injection prevention
- [ ] Admin activity logging (recommended)
- [ ] Two-factor authentication (recommended)
- [ ] Rate limiting (recommended)
- [ ] IP whitelisting (optional)

---

## 🔍 Security Monitoring

### Admin Activity Logging

**Recommended:**

```typescript
// Log all admin actions
logger.log(`Admin action: ${action}`, {
  adminId: user.id,
  action: "approve_credit",
  targetId: creditId,
  timestamp: new Date(),
});
```

---

## ⚠️ Critical Security Rules

1. **Never expose admin endpoints** to public
2. **Limit admin account creation** - manual only
3. **Use separate JWT secret** from client app
4. **Monitor admin activity** - log all critical actions
5. **Implement 2FA** for admin accounts (highly recommended)
6. **Regular access reviews** - audit admin accounts

---

**See Main Security Guide**: `../../SECURITY.md`
