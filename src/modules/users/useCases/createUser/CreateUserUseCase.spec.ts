import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserCaSe: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository

describe("Create user",() => {

  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserCaSe = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able crate a new user", async () => {
    const user = await createUserCaSe.execute({
      name: "Emerson",
      email: "emerson_10_s@hotmail.com",
      password: "test",
    });

    expect(user).toHaveProperty("id");
  })

  it("should't be able create a user with same e-mail", () => {
    expect(async () => {
      await createUserCaSe.execute({
        name: "Emerson",
        email: "emerson_10_s@hotmail.com",
        password: "test",
      });

      await createUserCaSe.execute({
        name: "Emerson",
        email: "emerson_10_s@hotmail.com",
        password: "test",
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
