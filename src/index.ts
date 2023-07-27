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
import {
  CreateTaskController,
  
} from "./controllers/create-task/create-task";
import { MongoTaskRepository } from "./repositories/mongo-task-repository";
import dotenv from "dotenv";
import { CreateTaskParams } from "./controllers/protocols";

const main = async () => {
  dotenv.config();

  const app = express();
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json({ type: 'application/json' }));
app.use(express.raw({ type: 'application/octet-stream' }));

  app.use(
    cors({
      origin: "*", // Permitir qualquer origem
      methods: "*", // Permitir qualquer método
    
      credentials: true, // Permitir credenciais (por exemplo, cookies, autenticação HTTP)
    })
  );

  app.use(express.json());

  app.use((req, res, next) => {
    const authorizationHeader = req?.headers?.authorization;
  
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
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

  app.post("/signin/", async (req, res) => {
    const mongoSignInRepository = new MongoSignInRepository();
    const signInController = new SignInController(mongoSignInRepository);
    const { body, statusCode } = await signInController.handle({
      body: req.body,
    });
    res.status(statusCode).send(body);
  });
  
  
  
  
  
  

  const mongoTaskRepository = new MongoTaskRepository();
  const createTaskController = new CreateTaskController(mongoTaskRepository);

  
  app.post("/:id/tasks", async (req, res) => {
    try {
      const { body, statusCode } = await createTaskController.handle({
        body: req.body as CreateTaskParams, 
      });
      res.status(statusCode).json(body);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      res.status(500).json({ error: "Erro ao criar tarefa. Verifique o servidor para mais detalhes." });
    }
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`listening on port ${port}!`));
};

main();
