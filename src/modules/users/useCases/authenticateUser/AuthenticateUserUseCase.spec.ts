import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let createUserCaSe: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUserUseCase

describe("Authenticate user", () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserCaSe = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "emerson_10_s@hotmail.com",
      name: "Emerson",
      password: "123"
    }

    await createUserCaSe.execute(user);


    const response = await authenticateUseCase.execute({
      email: user.email,
      password: user.password,
    });


    expect(response).toHaveProperty("token");
  })
})
