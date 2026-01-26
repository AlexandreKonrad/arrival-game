import { UniqueEntityID } from "./UniqueEntityID";
import { Entity } from "./Entity";
import { IDomainEvent } from "../events/IDomainEvent";

export abstract class AggregateRoot<T> extends Entity<T>{
    private _domainEvents: IDomainEvent[] = [];

    get domainEvents(): IDomainEvent[]
    {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void
    {
        this.domainEvents.push(domainEvent);
        // Futuro: Chamaremos aqui o DomainEvents.markAggregateForDispatch(this);
    }

    public clearEvents(): void
    {
        this._domainEvents = [];
    }
}