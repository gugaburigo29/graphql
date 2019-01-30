import {userQueries} from "./resources/user/user.schema";
import {postQueries} from "./resources/post/post.schema";
import {commentQueries} from "./resources/comment/comment.schema";
import {tokenMutations} from "./resources/token/token.schema";

const Query = `
    type Query {
        ${userQueries}
        ${postQueries}
        ${commentQueries},
        ${tokenMutations}
    }
`

export {
    Query
}
