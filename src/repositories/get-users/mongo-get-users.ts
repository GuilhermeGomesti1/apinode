import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { User } from "../../models/user";
import { MongoClient } from "../../database/mongo";
import { MongoUser } from "../mongo-protocols";
import { ObjectId } from 'mongodb';
export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const users =
      await MongoClient.db
        .collection <
      MongoUser > ("users").find({}).toArray();

      return users.map(({ _id, ...rest }) => ({
        id: new ObjectId(_id).toString(), // Convertendo o ObjectId para string
        ...rest,
      })) as User[];
  }
}
