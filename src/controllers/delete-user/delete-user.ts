import { User } from "../../models/user";
import { BadRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import {  IDeleteUserRepository } from "./protocols";

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      if (!id) {
        return BadRequest("Missing User id")
       
      }
      const user = await this.deleteUserRepository.deleteUser(id);
      return ok<User>(user)
    } catch (error) {
      return serverError();
    }
  }
}
