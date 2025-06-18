
import { DefaultSession } from "next-auth";
import { PermissionsMap } from "./permissions";

declare module "next-auth" {
    interface Session {
        user_id : string & DefaultSession
        permissions : PermissionsMap
        picture: string
    }
}