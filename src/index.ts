import express from "express";

import { GetUsersController } from "./controllers/get-users/get-users";
import { MongoGetUsersRepository } from "./repositories/get-users/mongo-get-users";
import { MongoClient } from "./database/mongo";
import { MongoCreateUserRepository } from "./repositories/create-user/mongo-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
import { MongoUpdateUserRepository } from "./repositories/update-user/mongo-update-user";
import { MongoDeleteUserRepository } from "./repositories/delete-user/mongo-delete-user";
import { DeleteUserController } from "./controllers/delete-user/delete-user";
import cors from "cors";
import { SignInController } from "./controllers/sign-in";
import { MongoSignInRepository } from "./repositories/signin-user/mongo-signin-user";
import { CreateTaskController } from "./controllers/create-task/create-task";
import { MongoTaskRepository } from "./repositories/mongo-task-repository";
import dotenv from "dotenv";
const main = async () => {
  dotenv.config();
  
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
      console.log("Token recebido no cabeçalho da requisição:", token);
    }
    next();
  });

  await MongoClient.connect();

  app.get("/users", async (req, res) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository();

    const getUsersController = new GetUsersController(mongoGetUsersRepository);

    const { body, statusCode } = await getUsersController.handle();

    res.status(statusCode).send(body);
  });
  app.post("/users", async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();

    const createUserController = new CreateUserController(
      mongoCreateUserRepository
    );

    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  app.patch("/users/:id", async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();

    const updateUserController = new UpdateUserController(
      mongoUpdateUserRepository
    );

    const { body, statusCode } = await updateUserController.handle({
      body: req.body,
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.delete("/users/:id", async (req, res) => {
    const mongoDeleteUserRepository = new MongoDeleteUserRepository();

    const deleteUserController = new DeleteUserController(
      mongoDeleteUserRepository
    );

    const { body, statusCode } = await deleteUserController.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.post("/signin", async (req, res) => {
    const mongoSignInRepository = new MongoSignInRepository();
    const signInController = new SignInController(mongoSignInRepository);
    const { body, statusCode } = await signInController.handle({
      body: req.body,
    });
    res.status(statusCode).send(body);
  });

  const mongoTaskRepository = new MongoTaskRepository();
  const createTaskController = new CreateTaskController(mongoTaskRepository);

  //app.post((`/users/${userId}/tasks`), async (req, res) => {
    app.post("/users/:userId/tasks", async (req, res) => {
      try {
        console.log("Requisição recebida na rota /users/:userId/tasks");
        console.log("Parâmetros da requisição:", req.params);
        console.log("Dados do corpo da requisição:", req.body);
        
        const { userId } = req.params;
        if (!userId) {
          throw new Error("User ID not provided in the request.");
        }
        
        // Verifica se o cabeçalho de autorização está presente na requisição
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Header 'authorization' not found in the request.");
        }
    
        const { body, statusCode } = await createTaskController.handle({
          body: req.body,
        });
    
        console.log("Resposta da controladora:", statusCode, body);
    
        res.status(statusCode).json(body);
      } catch (error) {
        console.error("Erro na rota /users/:userId/tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`listening on port ${port}!`));
};

main();
