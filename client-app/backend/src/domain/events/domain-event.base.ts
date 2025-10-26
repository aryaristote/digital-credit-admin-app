/**
 * Base Domain Event
 * All domain events extend this class
 */
export abstract class DomainEvent {
  public readonly eventType: string;
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor(eventType: string, occurredOn: Date) {
    this.eventType = eventType;
    this.occurredOn = occurredOn;
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    return `${this.eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Domain Event Handler Interface
 */
export interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

/**
 * Domain Event Bus (simplified implementation)
 */
export class DomainEventBus {
  private handlers: Map<string, IDomainEventHandler<DomainEvent>[]> = new Map();

  /**
   * Register an event handler
   */
  register<T extends DomainEvent>(
    eventType: string,
    handler: IDomainEventHandler<T>,
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as IDomainEventHandler<DomainEvent>);
  }

  /**
   * Publish domain events
   */
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.eventType) || [];
      for (const handler of handlers) {
        try {
          await handler.handle(event);
        } catch (error) {
          console.error(`Error handling event ${event.eventType}:`, error);
          // Don't throw - continue processing other handlers
        }
      }
    }
  }
}
