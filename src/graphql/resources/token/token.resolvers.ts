import * as jwt from 'jsonwebtoken'

import {DBConnection} from "../../../interfaces/DBConnectionInterface";
import {UserInstance} from "../../../models/UserModel";
import {JWT_SECRET} from "../../../utils";

export const tokenResolvers = {

    Mutation: {

        createToken: (parent, {email, password}, {db}: { db: DBConnection }) => {
            return db.User.findOne({
                where: {email},
                attributes: ['id', 'password']
            }).then((user: UserInstance) => {

                let errorMessage: string = 'Unathorizes, wrong email or password';
                if (!user || !user.isPassword(user.get('password'), password)) throw new Error(errorMessage);

                const payload = {sub: user.get('id')};

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            })
        }

    }

};
