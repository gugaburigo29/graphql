import {GraphQLResolveInfo} from "graphql";
import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {CommentInstance} from "../../../models/CommenModel";
import {Transaction} from "sequelize";
import {handleError, throwError} from "../../../utils";
import {compose} from "../../composable/composable.resolver";
import {authResolvers} from "../../composable/auth.resolver";
import {AuthUser} from "../../../interfaces/AuthUserInterface";
import {DataLoaders} from "../../../interfaces/DataLoadersInterface";
import {ResolverContext} from "../../../interfaces/ResolverContextInterface";

export const commentResolvers = {

    Comment: {

        user: (comment: CommentInstance, args, {db, dataloaders: {userLoader}}: { db: DBConnection, dataloaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return userLoader
                .load(comment.get('user'))
                .catch(handleError)
        },

        post: (comment: CommentInstance, args, {db, dataloaders: {postLoader}}: { db: DBConnection, dataloaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return postLoader
                .load(comment.get('post'))
                .catch(handleError)
        },

    },

    Query: {

        commentsByPost: (parent, {postId, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            postId = parseInt(postId);
            return context.db.Comment
                .findAll({
                    where: {post: postId},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info)
                })
                .catch(handleError)
        }

    },

    Mutation: {

        createComment: compose(...authResolvers)((parent, {input}, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, {transaction: t})
            }).catch(handleError)
        }),

        updateComment: compose(...authResolvers)((parent, {id, input}, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError(!comment, `Post whit id ${id} not found.`)
                        throwError(comment.get('user') !== authUser.id, `Unauthorized. You can only delete comment by yourself.`)
                        input.user = authUser.id;
                        return comment.update(input, {transaction: t})
                    })
            }).catch(handleError)
        }),

        deleteComment: compose(...authResolvers)((parent, {id}, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError(!comment, `Post whit id ${id} not found.`)
                        throwError(comment.get('user') !== authUser.id, `Unauthorized. You can only delete comment by yourself.`)
                        return comment.destroy({transaction: t})
                            .then(comment => !!comment)
                    })
            }).catch(handleError)
        })

    }

};
