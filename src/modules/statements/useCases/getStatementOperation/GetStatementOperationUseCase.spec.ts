import console from "console";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("get statement operation ", () => {

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
  });

  it("should be able get an statement operation by id user", async () => {
    const user = await createUserUseCase.execute({
      name: "Emerson",
      email: "emerson_10_s@hotmail.com",
      password: "test",
    });
    const statement = await createStatementUseCase.execute({
      amount: 150,
      description: "freeleance",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able get statement operation with user not exists", () => {
    expect( async () => {
      await getStatementOperationUseCase.execute({
        user_id: "test",
        statement_id: "test",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able get statement operation with an statement not exists", () => {
    expect( async () => {

      const user = await createUserUseCase.execute({
        name: "Emerson",
        email: "emerson_10_s@gmail.com",
        password: "test",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "test",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
