import { Squad } from "../../domain/entities/Squad";

export class SquadViewModel {
  static toHTTP(squad: Squad) {
    return {
      id: squad.id.toValue(),
      name: squad.name.toValue(),
      code: squad.code.toValue(),
      ownerId: squad.ownerId.toValue()
    };
  }
}