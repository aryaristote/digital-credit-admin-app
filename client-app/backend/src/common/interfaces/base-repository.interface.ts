/**
 * Base Repository Interface
 *
 * Defines the standard contract for all repositories
 * Ensures consistent data access patterns across modules
 */
export interface IBaseRepository<T> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities with optional filters
   */
  findAll(options?: any): Promise<T[]>;

  /**
   * Create new entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update entity by ID
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete entity by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if entity exists
   */
  exists(id: string): Promise<boolean>;
}
