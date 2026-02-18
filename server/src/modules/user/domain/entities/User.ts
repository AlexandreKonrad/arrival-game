import { Entity } from "src/shared/core/Entity";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { UserRole } from "../enums/UserRole";
import { Email } from "../vo/Email";
import { Name } from "../vo/Name";

interface UserProps{
    name: Name;
    email: Email;
    squadId: UniqueEntityID;
    role: UserRole;
    createdAt: Date;
}

export class User extends Entity<UserProps>{
    get name(): Name { return this.props.name; }
    get email(): Email { return this.props.email; }
    get squadId(): UniqueEntityID { return this.props.squadId; }
    get role(): UserRole { return this.props.role; }  
    get createdAt(): Date { return this.props.createdAt }

    private constructor(props: UserProps, id?: UniqueEntityID){
        super(props, id);
    }

    public static create(props: {name: Name, email: Email, squadId: UniqueEntityID, role: UserRole}, id?: UniqueEntityID): User
    {
        return new User({
            name: props.name,
            email: props.email,
            squadId: props.squadId,
            role: props.role,
            createdAt: new Date()
        }, id);
    }

    public static restore(props: UserProps, id: UniqueEntityID): User
    {
        return new User(props, id);
    }
}