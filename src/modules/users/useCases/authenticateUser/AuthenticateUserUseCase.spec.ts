import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

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

  it("should mpt be able to authenticate an nonexistent user", () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: "TEste@gmail.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it("should not be able to authenticate with incorrect password", () => {
    expect( async () => {
      const user: ICreateUserDTO = {
        email: "emersonads2019@gmail.com",
        name: "EmersonAds",
        password: "123"
      }

      await createUserCaSe.execute(user);

      await authenticateUseCase.execute({
        email: user.email,
        password: "5665456456"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})
