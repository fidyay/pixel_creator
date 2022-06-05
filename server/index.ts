import { config as configEnv } from "dotenv";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import mongoose from "mongoose";

configEnv() 

const connectionToDatabase = async () => {
    const mongoURL = process.env.DATABASE_URL as string
    await mongoose.connect(mongoURL)
}

connectionToDatabase()
.then(() => console.log('connected to database successfully'))
.catch(console.error)

// connect to database and write resolvers
const server = new ApolloServer({typeDefs, resolvers, context: ({req}) => {
    const getToken = (BearerToken: string) => {
        return BearerToken.includes('Bearer ') ? BearerToken.slice(7) : BearerToken
    }
    const bearerToken = req.headers.authorization || '' as string
    const token = getToken(bearerToken)
    return {token}
}});

server.listen().then(server => {
    console.log(`Listening at ${server.url}`)
})