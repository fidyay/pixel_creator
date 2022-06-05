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
  Frame: GraphQLJSON,
  Query: {
    async me(_, {name, password}, {token}) {
      if (token) {
        try {
          const { id } = jwt.verify(token, jwtPrivateKey)
          const user = await UserModel.findById(id)
          return {
            id: user.id,
            name: user.name,
            token,
            projects: user.projects
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
            token: jwt.sign({ name, id: user.id, password }, jwtPrivateKey),
            projects: user.projects
          }
        } catch(e) {
          console.error(e)
          return 'Invalid name or password'
        }
      }
    }
  },
  Mutation: {
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
    }
  }
};

export default resolvers