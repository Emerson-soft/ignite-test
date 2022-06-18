import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
describe("create Statement", () => {

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
  });

  it("should be able create an new statements", async () => {
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
    })

    expect(statement).toHaveProperty("id");
  });

  it("should not be able create an new statement with user not exists", () => {
    expect( async () =>  {
      await createStatementUseCase.execute({
        amount: 150,
        description: "freeleance",
        type: OperationType.DEPOSIT,
        user_id:"dasdasdasd",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });


  it("should not be able create an new statements if user not have balance positive", () => {

    expect( async () => {
      const user = await createUserUseCase.execute({
        name: "Emerson",
        email: "emerson_10_s@gmail.com",
        password: "test",
      });

      await createStatementUseCase.execute({
        amount: 150,
        description: "freeleance",
        type: OperationType.DEPOSIT,
        user_id: user.id!,
      });

      await createStatementUseCase.execute({
        amount: 200,
        description: "freeleance",
        type: OperationType.WITHDRAW,
        user_id: user.id!,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});

