import { User } from "src/modules/user/domain/entities/User";

export class UserViewModel{
    static toHTTP(user: User){
        return {
            squadId: user.squadId.toValue(),
            id: user.id.toValue(),
            name: user.name.value,
            email: user.email.value,
            role: user.role
        }
    }
}