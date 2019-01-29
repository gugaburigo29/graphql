import {GraphQLResolveInfo} from "graphql";
import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {CommentInstance} from "../../../models/CommenModel";

export const commentResolvers = {

    Comment: {

        user: (comment: CommentInstance, args, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.User
                .findById(comment.get('user'))
        },

        post: (comment: CommentInstance, args, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findById(comment.get('user'))
        },

    },

    Query: {

        commentsByPost: (parent, {postId, first = 10, offset = 0}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
                return db.Comment
                    .findAll({
                        where: {post: postId},
                        limit: first,
                        offset: offset
                    })
        }

    },

    Mutation: {



    }

}
