import {UserModel} from "../models/UserModel";
import {PostModel} from "../models/PostModel";
import {CommentModel} from "../models/CommenModel";

export interface ModelsInterface {

    Post: PostModel;
    User: UserModel;
    Comment: CommentModel;

}
