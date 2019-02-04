import {GraphQLResolveInfo} from "graphql";
import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {UserInstance} from "../../../models/UserModel";
import {Transaction} from "sequelize";
import {handleError, throwError} from "../../../utils";
import {AuthUser} from "../../../interfaces/AuthUserInterface";
import {compose} from "../../composable/composable.resolver";
import {authResolvers} from "../../composable/auth.resolver";
import {RequestedFields} from "../../ast/RequestedFields";
import {ResolverContext} from "../../../interfaces/ResolverContextInterface";

export const userResolvers = {

    User: {

        posts: (user: UserInstance, {first = 10, offset = 0}, {db, requestedFields}: { db: DBConnection, requestedFields: RequestedFields }, info: GraphQLResolveInfo) => {
            return db.Post
                .find({
                    where: {author: user.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                }).catch(handleError)
        },

    },

    Query: {
        users: ((parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                }).catch(handleError)
        }),
        user: (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.User.findById(id, {
                attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
            })
                .then((user: UserInstance): UserInstance => {
                    throwError(!user, `User whit id ${id} not found.`);
                    return user;
                }).catch(handleError)
        },
        currentUser: compose(...authResolvers)((parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User
                .findById(context.authUser.id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                })
                .then((user: UserInstance) => {
                    throwError(!user, `User whit id ${context.authUser.id} not found.`);
                    return user;
                }).catch(handleError)
        })
    },

    Mutation: {

        createUser: (parent, {input}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .create(input, {transaction: t});
            }).catch(handleError)
        },


        updateUser: compose(...authResolvers)((parent, {input}, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User whit id ${authUser.id} not found.`);
                        return user.update(input, {transaction: t})
                    })
            }).catch(handleError)
        }),

        updateUserPassword:
            compose(...authResolvers)((parent, {input}, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
                return db.sequelize.transaction((t: Transaction) => {
                    return db.User
                        .findById(authUser.id)
                        .then((user: UserInstance) => {
                            throwError(!user, `User whit id ${authUser.id} not found.`);

                            return user.update(input, {transaction: t})
                                .then((user: UserInstance) => !!user)
                        })
                }).catch(handleError)
            }),

        deleteUser: compose(...authResolvers)((parent, args, {db, authUser}: { db: DBConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User whit id ${authUser.id} not found.`);
                        return user.destroy({transaction: t})
                            .then((user) => !!user)
                    })
            }).catch(handleError)
        }),
    }

};
