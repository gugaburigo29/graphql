import {DBConnection} from "./DBConnectionInterface";
import {AuthUser} from "./AuthUserInterface";

export interface ResolverContext {

    db?: DBConnection;
    authorization?: string;
    authUser?: AuthUser;

}
