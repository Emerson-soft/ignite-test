import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUseUseCase: CreateUserUseCase;
describe("Show User Profile", () => {

  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
    createUseUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able search an user by id", async () => {
    const user = await createUseUseCase.execute({
      name: "Emerson",
      email: "emerson_10_s@hotmail.com",
      password: "test",
    });

    const responseUser = await showUserProfileUseCase.execute(user.id!);

    expect(responseUser).toHaveProperty("id");
  });

  it("should not be able search un user with not exists", () => {
    expect( async () => {
      await showUserProfileUseCase.execute("22138545asdasd56");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
