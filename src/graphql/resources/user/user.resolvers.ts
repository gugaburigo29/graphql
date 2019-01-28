import {GraphQLResolveInfo} from "graphql";
import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {UserInstance} from "../../../models/UserModel";

export const userResolvers = {

    Query: {
        users: (parent, {first = 10, offset = 0}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.User
                .findAll({
                    limit: first,
                    offset: offset
                })
        },
        user: (parent, {id}, {db}: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.User.findById(id)
                .then((user: UserInstance): UserInstance => {
                    if (!user) throw new Error(`User whit id ${id} not found.`)
                    return user;
                })
        }
    }

};
