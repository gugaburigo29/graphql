import {DBConnection} from "./DBConnectionInterface";
import {AuthUser} from "./AuthUserInterface";
import {DataLoaders} from "./DataLoadersInterface";

export interface ResolverContext {

    db?: DBConnection;
    authorization?: string;
    authUser?: AuthUser;
    dataloaders?: DataLoaders;

}
