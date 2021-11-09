import {convertGetOutput, convertListOutput, ListOutput, user,} from "./output";
import {DBClient} from "../../domain/DBClient";
import {Repository} from "../../domain/users";
import {getList, get, add} from "./logic";
import {AddInput, GetInput} from "./input";
import {Failure, Result, Success} from "../../errorTypes/resultType";

export type Interactor = {
    GetList(): Promise<ListOutput>;
    Get(input: GetInput): Promise<Result<user, Error>>;
    Add(input: AddInput): Promise<Result<void, Error>>;
}

export class usersUsecase implements Interactor {
    private readonly repository: Repository;
    private readonly dbClient: DBClient
    constructor(repository: Repository, dbClient: DBClient) {
        this.repository = repository;
        this.dbClient = dbClient
    }
    async GetList(): Promise<ListOutput> {
        const data = await getList(this.dbClient, this.repository);
        return convertListOutput(data);
    }
    async Get(input: GetInput): Promise<Result<user, Error>> {
        const data = await get(this.dbClient, this.repository, input)
        if (data.isFailure()) {
            return new Failure(data.value);
        } else {
            return new Success(convertGetOutput(data.value));
        }
    }
    async Add(input: AddInput): Promise<Result<void, Error>> {
        const res = await add(this.dbClient, this.repository, input);
        if (res.isFailure()) {
            return new Failure(res.value);
        } else {
            return new Success(undefined);
        }
    }
}
