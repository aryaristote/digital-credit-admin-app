// For now, admins use the same User entity but with role='admin'
// This references the User entity from the shared database
// In a production scenario, you might create a separate Admin table or use the same User table with role differentiation

export { User as Admin } from '../../../shared/entities/user.entity';

