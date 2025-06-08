
import { DefaultSession } from "next-auth";
import { PermissionsMap } from "./permissions";
import { IUser } from "../models/interfaces/users";
declare module "next-auth" {
    interface Session extends IUser {
        user_id: string & DefaultSession;
        permissions: PermissionsMap;
        picture: string;
    }
}