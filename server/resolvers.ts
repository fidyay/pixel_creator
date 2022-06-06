import GraphQLJSON from "graphql-type-json";
import { config as configEnv } from "dotenv";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserModel from "./models/User";
import UserProjectModel from "./models/UserProject";

configEnv()

const jwtPrivateKey = process.env.JWT_PRIVATEKEY as string

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    // user accounts manipulation
    async me(_, {name, password}, {token}) {
      if (token) {
        try {
          const { id } = jwt.verify(token, jwtPrivateKey)
          const user = await UserModel.findById(id)
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
          const user = await UserModel.findOne({name, password: hash})
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
      if (!token) return 'User is not authorized'
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
    async updateAccountInfo(_, {name, password}, {token}) {
      if (!token) return 'User is not authorized'
      const { id } = jwt.verify(token, jwtPrivateKey)
      const user = await UserModel.findById(id)
      user.name = name
      user.password = bcrypt.hashSync(password, salt)
      await user.save()
      return {
        name: user.name,
        token: jwt.sign({ name, id: user.id, password }, jwtPrivateKey),
        id: user.id
      }
    },
    async deleteAccount (_, __, {token}) {
      if (!token) return 'User is not authorized'
      try {
        const { id } = jwt.verify(token, jwtPrivateKey)
        await UserModel.findByIdAndDelete(id)
        return {
          type: 'Success'
        }
      } catch(e) {
        console.error(e)
        return {
          type: 'Error'
        }
      }
    },
      // projects manipulation
      async createProject(_, {name, type, background, widthInSquares, heightInSquares, frames}, {token}) {
        if (!token) return 'User is not authorized'
        const { id: authorId } = jwt.verify(token, jwtPrivateKey)
        const newProject = new UserProjectModel({name, type, background, widthInSquares, heightInSquares, frames, author: authorId})
        await newProject.save()
        return {
          id: newProject.id,
          name,
          type,
          background,
          widthInSquares,
          heightInSquares,
          frames
        }
      },
      async updateProject(_, {id, name, frames}, {token}) {
        if (!token) return 'User is not authorized'
        const projectDoc = await UserProjectModel.findById(id)
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
        if (!token) return 'User is not authorized'
        const { id: authorId } = jwt.verify(token, jwtPrivateKey)
        const project = await UserProjectModel.findById(id)
        if (project.author.toString() !== authorId) return { type: "Error" }
        await project.delete()
        return {
          type: "Success"
        }
      }
  }
}

export default resolvers