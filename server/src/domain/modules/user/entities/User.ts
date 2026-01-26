import { Entity } from "src/domain/shared/core/Entity";
import { UniqueEntityID } from "src/domain/shared/core/UniqueEntityID";
import { UserRole } from "../enums/UserRole";
import { Email } from "../vo/Email";
import { Name } from "../vo/Name";

interface UserProps{
    name: Name;
    email: Email;
    squadId: UniqueEntityID;
    role: UserRole;
}

export class User extends Entity<UserProps>{
    get name() { return this.props.name; }
    get email() { return this.props.email; }
    get squadId() { return this.props.squadId; }
    get role() { return this.props.role; }   

    public static create(props: UserProps, id?: UniqueEntityID): User
    {
        return new User(props, id);
    }
}