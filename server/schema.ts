import { gql } from "apollo-server";

const typeDefs = gql`
    scalar Frame

    # queries

    type Status {
        type: String
    }

    type Project {
        id: ID,
        name: String,
        type: String,
        frames: [Frame!]!,
        background: String,
        widthInSquares: Int,
        heightInSquares: Int
    }

    type UserInfo {
        id: ID,
        token: String,
        name: String,
        projects: [ID!]!
    }

    type Query {
        me(name: String, password: String): UserInfo
    }

    # mutations

    type Mutation {
        createAccount(name: String, password: String): UserInfo
        updateAccountInfo(name: String, password: String): UserInfo
        deleteAccount: Status
    }
`

export default typeDefs