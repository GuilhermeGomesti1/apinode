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
import { CreateTaskParams } from "./controllers/protocols";
import { GetTasksController } from "./controllers/get-tasks/get-task";

const main = async () => {
  dotenv.config();

  const app = express();

  app.use(
    cors({
      origin: "ttps://myapisystem-guilhermegomesti1.vercel.app", // Permitir qualquer origem
      methods: "*", // Permitir qualquer método
      exposedHeaders: ["Authorization"],
      credentials: true, // Permitir credenciais (por exemplo, cookies, autenticação HTTP)
      allowedHeaders: "*",
    })
  );

  app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(200).send();
  });

  app.use((req, res, next) => {
    console.log("Requisição recebida:", req.method, req.url, req.headers);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ type: "application/json" }));
  app.use(express.raw({ type: "application/octet-stream" }));

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

  // Middleware para verificar o token apenas para a rota de criação de tarefas
  app.post("/:id/tasks", async (req, res, next) => {
    console.log("Middleware para verificar token foi chamado");
    const authorizationHeader = req?.headers?.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      // Token não fornecido ou inválido
      console.log("Token não fornecido ou inválido");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorizationHeader.split(" ")[1];
    console.log("Token recebido no cabeçalho da requisição:", token);
    if (!token) {
      console.log("Token não fornecido");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { body, statusCode } = await createTaskController.handle({
        body: req.body as CreateTaskParams,
        headers: { Authorization: `Bearer ${token}` },
      });
      res.status(statusCode).json(body);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      res.status(500).json({
        error: "Erro ao criar tarefa. Verifique o servidor para mais detalhes.",
      });
    }
  });

  app.get("/users/:id/tasks", async (req, res) => {
    const userId = req.params.id;

    // Verificar se o userId é válido ou se é necessário tratamento adicional aqui

    const mongoTaskRepository = new MongoTaskRepository();
    const getTasksController = new GetTasksController(mongoTaskRepository);

    const { body, statusCode } = await getTasksController.handle({
      params: { userId },
    });
    res.status(statusCode).json(body);
  });

  app.delete("/tasks/:id", async (req, res) => {
    const taskId = req.params.id;

    try {
      const deletionResult = await mongoTaskRepository.deleteTaskById(taskId);

      if (deletionResult) {
        // Tarefa apagada com sucesso
        res.status(200).json({ message: "Tarefa apagada com sucesso!" });
      } else {
        // Tarefa não encontrada ou ocorreu algum erro
        res
          .status(404)
          .json({
            error:
              "Tarefa não encontrada ou ocorreu um erro ao apagar a tarefa.",
          });
      }
    } catch (error: any) {
      console.error("Erro ao apagar a tarefa:", error.message);
      res
        .status(500)
        .json({
          error:
            "Erro ao apagar a tarefa. Verifique o servidor para mais detalhes.",
        });
    }
  });

  app.put("/tasks/:id", async (req, res) => {
    const taskId = req.params.id;

    try {
      const { title, description } = req.body;
      console.log("Title:", title);
      console.log("Description:", description);
      if (!title || !description) {
        return res
          .status(400)
          .json({
            error: "Title and description are required for task update.",
          });
      }

      const updatedTask = await mongoTaskRepository.updateTask(taskId, {
        
        title,
        description,
      });
      console.log("Title:", title);
      console.log("Description:", description);
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found." });
      }

      return res.status(200).json(updatedTask);
    } catch (error: any) {
      console.error("Error updating task:", error.message);
      return res.status(500).json({
        error: "Error updating task. Please check the server for more details.",
      });
    }
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`listening on port ${port}!`));
};

main();
