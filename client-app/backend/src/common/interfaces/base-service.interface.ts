/**
 * Base Service Interface
 *
 * Defines standard service methods
 * Ensures consistent business logic patterns
 */
export interface IBaseService<T, CreateDto, UpdateDto> {
  /**
   * Get entity by ID
   */
  findOne(id: string): Promise<T>;

  /**
   * Get all entities with pagination
   */
  findAll(page?: number, limit?: number): Promise<{ data: T[]; total: number }>;

  /**
   * Create new entity
   */
  create(createDto: CreateDto): Promise<T>;

  /**
   * Update entity
   */
  update(id: string, updateDto: UpdateDto): Promise<T>;

  /**
   * Delete entity
   */
  remove(id: string): Promise<void>;
}
