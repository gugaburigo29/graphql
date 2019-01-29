import {GraphQLResolveInfo} from "graphql";
import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {PostInstance} from "../../../models/PostModel";

export const postResolvers = {

    Post: {

        author: (post: PostInstance, args, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.User
                .findById(post.get('author'))
        },

        comments: (post: PostInstance, {first = 10, offset = 0}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.Comment
                .findAll({
                    where: {post: post.get('id')},
                    limit: first,
                    offset: offset
                })
        },

    },

    Query: {
        posts: (parent, {first = 10, offset = 0}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findAll({
                    limit: first,
                    offset: offset
                })
        },

        post: (parent, {id}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findById(id)
                .then((post: PostInstance) => {
                    if (!post) throw new Error(`Post whit id ${id} not found.`)
                    return post
                })
        },
    }

}
