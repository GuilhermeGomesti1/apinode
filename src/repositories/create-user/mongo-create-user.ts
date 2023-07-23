import {
  CreateUserParams,
  ICreateUserRepository,
} from "../../controllers/create-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";
import { v4 as uuidv4 } from 'uuid';
export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    const userId = uuidv4();
    
    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne({ ...params, tasks:[],id: userId  });

    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: insertedId });

    if (!user) {
      throw new Error("User not created");
    }

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
    
  }
}
