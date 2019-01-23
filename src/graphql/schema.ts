import {makeExecutableSchema} from 'graphql-tools'

const users: any[] = [
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
]

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
    User: { // Resolver trivial
        id: (user) => user.id,
        name: (user) => user.name,
        email: (user) => user.email,
    },
    Query: {
        allUsers: () => users
    },
    Mutation: {
        createUser: (parent, args) => {
            const newUser = {
                ...args,
                id: users.length + 1
            };
            users.push(newUser);
            return newUser;
        }
    }
};

export default makeExecutableSchema({typeDefs, resolvers});
