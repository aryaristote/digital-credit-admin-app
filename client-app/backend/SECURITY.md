# Client Backend Security Guide

Detailed security documentation for the Client Application Backend.

---

## 🔐 Authentication Security

### Password Hashing

**Implementation:**

```typescript
// Password hashing with bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Security Features:**

- ✅ bcrypt with 10 salt rounds
- ✅ Secure password comparison
- ✅ Passwords never stored in plain text
- ✅ Password excluded from API responses

### JWT Token Security

**Access Tokens:**

- Expiration: 15 minutes
- Contains: userId, email, role
- Secret: Strong random string (32+ chars)

**Refresh Tokens:**

- Expiration: 7 days
- Stored hashed in database
- Rotated on each use
- Tracks device information

**Token Generation:**

```typescript
const accessToken = this.jwtService.sign(
  { sub: user.id, email: user.email, role: user.role },
  { expiresIn: '15m' },
);
```

---

## 🛡️ Authorization

### Role-Based Access Control

**Customer Access:**

- Access to own data only
- Cannot access other users' data
- Standard CRUD operations on own resources

**Guards Implementation:**

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser('id') userId: string) {
  // Only accessible by authenticated customers
}
```

---

## 🔒 Data Protection

### Input Validation

**DTO Validation:**

```typescript
@IsEmail()
@IsString()
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
password: string;
```

**Global Validation:**

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### SQL Injection Prevention

**TypeORM Protection:**

- Parameterized queries
- Entity-based queries
- No raw SQL with user input

**Example:**

```typescript
// ✅ Safe
const user = await userRepository.findOne({ where: { email } });

// ❌ Unsafe (not used)
// const user = await query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🔐 Session Management

### Session Tracking

**Features:**

- Device information tracking
- IP address logging
- Browser detection
- Session expiration
- Multiple device support

**Session Storage:**

```typescript
// Refresh tokens hashed before storage
refreshToken: await bcrypt.hash(tokens.refreshToken, 10);
```

---

## 🚨 Security Best Practices

### Environment Variables

**Required Secrets:**

```env
JWT_SECRET=strong-random-secret-min-32-chars
JWT_REFRESH_SECRET=strong-random-secret-min-32-chars
DB_PASSWORD=strong-database-password
```

**Generation:**

```bash
# Generate strong secret
openssl rand -hex 32
```

### Error Handling

**Secure Error Responses:**

```typescript
// ❌ Don't expose internal details
throw new Error('Database connection failed at line 123');

// ✅ Generic error messages
throw new InternalServerErrorException('An error occurred');
```

---

## 📊 Security Checklist

- [x] Password hashing (bcrypt, 10 rounds)
- [x] JWT authentication
- [x] Refresh token rotation
- [x] Session management
- [x] Input validation
- [x] SQL injection prevention
- [x] Role-based access control
- [x] Environment variables
- [x] CORS configuration
- [x] Error handling
- [ ] Rate limiting (recommended)
- [ ] Request logging
- [ ] Security headers

---

## 🔍 Security Monitoring

### Recommended Logging

```typescript
// Log authentication attempts
logger.log(`Login attempt: ${email}`);

// Log failed authentications
logger.warn(`Failed login: ${email}`);

// Log security events
logger.error(`Security: ${event}`, { userId, ip });
```

---

**See Main Security Guide**: `../../SECURITY.md`
