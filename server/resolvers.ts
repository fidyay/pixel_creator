import GraphQLJSON from "graphql-type-json";
import { config as configEnv } from "dotenv";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserModel from "./models/User";
import UserProjectModel from "./models/UserProject";
import { User } from "./models/User";
import { UserProject } from "./models/UserProject";
import { ApolloError } from "apollo-server-express";

configEnv()

const jwtPrivateKey = process.env.JWT_PRIVATEKEY as string

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    // user accounts manipulation
    async me(_, {name, password}: User, {token}) {
      if (token) {
        try {
          const { id } = jwt.verify(token, jwtPrivateKey)
          const user = await UserModel.findById(id) as User
          return {
            id: user.id,
            name: user.name,
            token
          }
        } catch (e) {
          console.error(e)
          return 'Token is invalid'
        }
      }
      if (name && password) {
        try {
          const hash = bcrypt.hashSync(password, salt)
          const user = await UserModel.findOne({name, password: hash}) as User
          return {
            id: user.id,
            name: user.name,
            token: jwt.sign({ name, id: user.id, password }, jwtPrivateKey)
          }
        } catch(e) {
          console.error(e)
          return 'Invalid name or password'
        }
      }
    },
    // projects manipulation
    async projects(_, __, {token}) {
      if (!token) throw new ApolloError('User is not authorized')
      const { id: authorId } = jwt.verify(token, jwtPrivateKey)
      const projects = await UserProjectModel.find({author: authorId})
      return projects
    }
    
  },
  Mutation: {
    // user accounts manipulation
    async createAccount(_, {name, password}) {
      const hash = bcrypt.hashSync(password, salt)
      const user = new UserModel({name, password: hash, projects: []})
      await user.save()
      const token = jwt.sign({ name, id: user.id, password }, jwtPrivateKey) as string
      return {
        name,
        token,
        id: user.id,
        projects: []
      }
    },
    async changeName(_, {name}, {token}) {
      if (!token) throw new ApolloError('User is not authorized')
      const { id, password } = jwt.verify(token, jwtPrivateKey)
      const user = await UserModel.findById(id) as User
      if (name === user.name) throw new ApolloError('Cannot set name to the old value.')
      user.name = name
      await user.save()
      return {
        name: user.name,
        token: jwt.sign({ name, id: user.id, password }, jwtPrivateKey),
        id: user.id
      }
    },
    async changePassword(_, {password}, {token}) {
      if (!token) throw new ApolloError('User is not authorized')
      const { id } = jwt.verify(token, jwtPrivateKey)
      const hash = bcrypt.hashSync(password, salt)
      const user = await UserModel.findById(id) as User
      if (hash === user.password) throw new ApolloError('Cannot set password to the old value.')
      user.password = hash
      await user.save()
      return {
        name: user.name,
        token: jwt.sign({ name: user.name, id: user.id, password }, jwtPrivateKey),
        id: user.id
      }
    },
    async deleteAccount (_, __, {token}) {
      if (!token) throw new ApolloError('User is not authorized')
      const { id } = jwt.verify(token, jwtPrivateKey)
      await UserModel.findByIdAndDelete(id)
      const projects = await UserProjectModel.find({author: id})
      await Promise.all(projects.map(project => project.delete()))
      return {
        status: 'success'
      }
    },
      // projects manipulation
      async createProject(_, {drawing}, {token}) {
        if (!token) throw new ApolloError('User is not authorized')
        const { id: authorId } = jwt.verify(token, jwtPrivateKey)
        const newProject = new UserProjectModel({
          _id: drawing.id,
          name: drawing.name,
          author: authorId,
          background: drawing.background,
          widthInSquares: drawing.widthInSquares,
          heightInSquares: drawing.heightInSquares,
          type: drawing.type,
          frames: drawing.frames
        })
        await newProject.save()
        return {
          ...drawing
        }
      },
      async updateProject(_, {id, name, frames}, {token}) {
        if (!token) throw new ApolloError('User is not authorized')
        const projectDoc = await UserProjectModel.findById(id) as UserProject
        projectDoc.name = name
        projectDoc.frames = frames
        await projectDoc.save()
        return {
          id,
          name,
          type: projectDoc.type,
          background: projectDoc.background,
          widthInSquares: projectDoc.widthInSquares,
          heightInSquares: projectDoc.heightInSquares,
          frames
        }
      },
      async deleteProject(_, {id}, {token}) {
        if (!token) throw new ApolloError('User is not authorized')
        const { id: authorId } = jwt.verify(token, jwtPrivateKey)
        const project = await UserProjectModel.findById(id) as UserProject
        if (project.author.toString() !== authorId) return { type: "Error" }
        await project.delete()
        return {
          status: 'success'
        }
      }
    }
}

export default resolvers