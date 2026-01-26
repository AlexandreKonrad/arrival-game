import { randomUUID } from "node:crypto";

export class UniqueEntityID{
    private value: string;

    constructor(id?: string){
        this.value = id ? id : randomUUID();
    }

    toString(){
        return this.value;
    }

    toValue(){
        return this.value;
    }

    equals(id?: UniqueEntityID): boolean
    {
        if(id === null || id === undefined) return false;

        if(!(id instanceof UniqueEntityID)) return false;

        return id.toValue() === this.value;
    }
}