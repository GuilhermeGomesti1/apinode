import { MongoClient as Mongo , Db} from "mongodb";
export const MongoClient = {
    client: undefined,
    db:undefined,
  async connect(): Promise<void> {
    const url = process.env.MONGODB_URL;
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    const client = new Mongo()
  },
};
