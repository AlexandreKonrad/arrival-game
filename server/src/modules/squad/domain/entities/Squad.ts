import { AggregateRoot } from "src/shared/core/AggregateRoot";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { SquadCode } from "../vo/SquadCode";
import { Name } from "../vo/Name";

interface SquadProps{
    name: Name;
    code: SquadCode;
    ownerId: UniqueEntityID;
    createdAt: Date
}

export class Squad extends AggregateRoot<SquadProps>{

    get name(): Name { return this.props.name; }
    get code(): SquadCode { return this.props.code; }
    get ownerId(): UniqueEntityID { return this.props.ownerId }
    get createdAt(): Date { return this.props.createdAt }

    private constructor(props: SquadProps, id?: UniqueEntityID){
        super(props, id);
    }

    public static create(props: { name: Name; ownerId: UniqueEntityID }, id?: UniqueEntityID): Squad
    {
        const code = SquadCode.generate();

        const squad = new Squad({
            name: props.name,
            code: code,
            ownerId: props.ownerId,
            createdAt: new Date(),
        }, id);

        return squad
    }

    public static restore(props: SquadProps, id: UniqueEntityID): Squad
    {
        return new Squad(props, id);
    }
}