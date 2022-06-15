import { gql } from "apollo-server";

const typeDefs = gql`
    scalar JSON

    # queries

    type Status {
        status: String
    }

    type UserInfo {
        id: ID,
        token: String,
        name: String
    }

    type Project {
        id: ID,
        name: String,
        type: String,
        frames: [JSON!]!,
        background: String,
        widthInSquares: Int,
        heightInSquares: Int
    }

    type Query {
        me(name: String, password: String): UserInfo,
        projects: [Project!]!
    }

    # mutations

    type Mutation {
        createAccount(name: String, password: String): UserInfo,
        changeName(name: String): UserInfo,
        changePassword(password: String): UserInfo,
        deleteAccount: Status,
        createProject(name: String, type: String, background: String, widthInSquares: Int, heightInSquares: Int, frames: [JSON!]!): Project
        updateProject(id: ID, name: String, frames: [JSON!]!): Project
        deleteProject(id: ID): Status
    }
`

export default typeDefs