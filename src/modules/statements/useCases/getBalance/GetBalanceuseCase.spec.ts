import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Balance", () => {

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUserRepository);
  });

  it("should be able get balance with id_use", async () => {

    const user = await createUserUseCase.execute({
      name: "Emerson",
      email: "emerson_10_s@hotmail.com",
      password: "test",
    });

    await createStatementUseCase.execute({
      amount: 150,
      description: "freeleance",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    await createStatementUseCase.execute({
      amount: 1050,
      description: "teste",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id!
    });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able get balance with user not exist", () => {
    expect( async () => {
      await getBalanceUseCase.execute({
        user_id: "Teste",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
