import { config as configEnv } from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import mongoose from "mongoose";
import http from "http";
import path from "path";

configEnv() 

const connectionToDatabase = async () => {
    const mongoURL = process.env.DATABASE_URL as string
    await mongoose.connect(mongoURL)
}

connectionToDatabase()
.then(() => console.log('Connected to database successfully'))
.catch(console.error)

const startServer = async () => {
    const app = express()

    app.use(express.static('../client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve('../client/build/index.html'))
    })
    
    const httpServer = http.createServer(app)

    const server = new ApolloServer({typeDefs, resolvers, plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], context: ({req}) => {
        const getToken = (BearerToken: string) => {
            return BearerToken.includes('Bearer ') ? BearerToken.slice(7) : BearerToken
        }
        const bearerToken = req.headers.authorization || '' as string
        const token = getToken(bearerToken)
        return {token}
    }})

    await server.start()
    
    server.applyMiddleware({ app, path: '/graphql' })
    
    const port = process.env.PORT || 4000
    
    await new Promise<void>(resolve => httpServer.listen({ port }, resolve))
    console.log(`Server ready at http://localhost:${port}`)
}

startServer().catch(console.error)