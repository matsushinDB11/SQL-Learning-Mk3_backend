import { Repository, user, user as userDomain } from "../../domain/users";
import { Failure, Result, Success } from "../../errorHelper/resultType";
import {
    DBInternalError,
    resourceNotFoundError,
} from "../../errorHelper/errors";
import { DBClient } from "../../domain/DBClient";
import PrismaInfra from "./PrismaInfra";
import { convertPrismaError } from "../../errorHelper/helperFunc";

export default class UsersInfra implements Repository {
    GetList = async (
        dbClient: PrismaInfra
    ): Promise<Result<userDomain[], Error>> => {
        try {
            const rowData = await dbClient.ConnectDB().user.findMany();
            if (rowData == []) {
                return new Failure(new resourceNotFoundError("Get User List"));
            } else {
                const resData: userDomain[] = [];
                rowData.forEach((data) => {
                    resData.push({
                        ID: data.id,
                        email: data.email,
                        isAdmin: data.isAdmin,
                    });
                });
                return new Success(resData);
            }
        } catch (e) {
            return new Failure(new DBInternalError("Get User List"));
        }
    };

    Get = async (
        dbClient: DBClient,
        userID: number
    ): Promise<Result<userDomain, Error>> => {
        try {
            const rowData = await dbClient.ConnectDB().user.findUnique({
                where: {
                    id: userID,
                },
            });
            if (rowData == null) {
                return new Failure(
                    new resourceNotFoundError("memoID: " + String(userID))
                );
            } else {
                const resData: userDomain = {
                    ID: rowData.id,
                    email: rowData.email,
                    isAdmin: rowData.isAdmin,
                };
                return new Success(resData);
            }
        } catch (e) {
            return new Failure(new DBInternalError("GetUser"));
        }
    };
    Add = async (
        dbClient: DBClient,
        email: string,
        isAdmin: boolean | undefined
    ): Promise<Result<void, Error>> => {
        try {
            await dbClient.ConnectDB().user.create({
                data: {
                    email: email,
                    isAdmin: isAdmin,
                },
            });
        } catch (e) {
            return new Failure(new DBInternalError("Add User Fail"));
        }
        return new Success(undefined);
    };

    Update = async (
        dbClient: DBClient,
        userID: number,
        email: string,
        isAdmin: boolean | undefined
    ): Promise<Result<void, Error>> => {
        try {
            await dbClient.ConnectDB().user.update({
                where: { id: userID },
                data: {
                    email: email,
                    isAdmin: isAdmin,
                },
            });
        } catch (e) {
            const errorType = convertPrismaError(
                e,
                "userID: " + String(userID),
                "Update User"
            );
            return new Failure(errorType);
        }
        return new Success(undefined);
    };

    Delete = async (
        dbClient: DBClient,
        userID: number
    ): Promise<Result<void, Error>> => {
        try {
            await dbClient.ConnectDB().user.delete({
                where: { id: userID },
            });
        } catch (e) {
            const errorType = convertPrismaError(
                e,
                "userID: " + String(userID),
                "Delete User"
            );
            return new Failure(errorType);
        }
        return new Success(undefined);
    };

    GetByEmail = async (
        dbClient: DBClient,
        email: string
    ): Promise<Result<user, Error>> => {
        try {
            const rowData = await dbClient.ConnectDB().user.findUnique({
                where: {
                    email: email,
                },
            });
            if (rowData == null) {
                return new Failure(
                    new resourceNotFoundError("email: " + String(email))
                );
            } else {
                const resData: userDomain = {
                    ID: rowData.id,
                    email: rowData.email,
                    isAdmin: rowData.isAdmin,
                };
                return new Success(resData);
            }
        } catch (e) {
            return new Failure(new DBInternalError("GetUserByEmail"));
        }
    };
}
