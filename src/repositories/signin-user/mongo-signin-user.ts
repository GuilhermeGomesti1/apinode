import { User } from "../../models/user";
import { ISignInRepository } from "../../controllers/protocols";
import { MongoClient } from "../../database/mongo";

export class MongoSignInRepository implements ISignInRepository {
  async signIn(email: string, password: string): Promise<User | null> {
    const user = await MongoClient.db.collection<User>("users").findOne({ email, password });
    return user;
  }
}