import * as DataLoader from 'dataloader'

import {DBConnection} from "../../interfaces/DBConnectionInterface";
import {DataLoaders} from "../../interfaces/DataLoadersInterface";
import {UserInstance} from "../../models/UserModel";
import {UserLoader} from "./UserLoader";
import {PostInstance} from "../../models/PostModel";
import {PostLoader} from "./PostLoader";

export class DataLoaderFactory {

    constructor(
        private db: DBConnection
    ) {
    }

    getLoaders(): DataLoaders {
        return {
            userLoader: new DataLoader<number, UserInstance>(
                (ids: number[]) => UserLoader.batchUser(this.db.User, ids)
            ),
            postLoader: new DataLoader<number, PostInstance>(
                (ids: number[]) => PostLoader.bathPosts(this.db.Post, ids)
            )
        }
    }
}
