"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const users = [
    {
        id: 1,
        name: 'Jon',
        email: 'gugaba29@gmai.com'
    },
    {
        id: 1,
        name: 'teste',
        email: 'gugabaasd9@gmai.com'
    }
];
const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }   
    
    type Query {
        allUsers: [User!]!
    }
    
    type Mutation {
        createUser(name: String!, email: String!): User
    }
`;
const resolvers = {
    User: {
        id: (user) => user.id,
        name: (user) => user.name,
        email: (user) => user.email,
    },
    Query: {
        allUsers: () => users
    },
    Mutation: {
        createUser: (parent, args) => {
            const newUser = Object.assign({}, args, { id: users.length + 1 });
            users.push(newUser);
            return newUser;
        }
    }
};
exports.default = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers });
