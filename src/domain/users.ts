import { DBClient } from "./DBClient";
import { Result } from "../errorHelper/resultType";

export interface Repository {
    GetList(dbClient: DBClient): Promise<Result<user[], Error>>;
    Get(dbClient: DBClient, userID: number): Promise<Result<user, Error>>;
    GetByEmail(dbClient: DBClient, email: string): Promise<Result<user, Error>>;
    Add(
        dbClient: DBClient,
        email: string,
        isAdmin: boolean | undefined
    ): Promise<Result<void, Error>>;
    Update(
        dbClient: DBClient,
        userID: number,
        email: string,
        isAdmin: boolean | undefined
    ): Promise<Result<void, Error>>;
    Delete(dbClient: DBClient, userID: number): Promise<Result<void, Error>>;
}

export type user = {
    ID: number;
    email: string;
    isAdmin: boolean;
};
