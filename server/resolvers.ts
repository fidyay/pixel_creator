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