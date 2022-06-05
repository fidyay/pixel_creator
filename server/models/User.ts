import { Schema, model, Document, ObjectId } from 'mongoose'

export interface User extends Document {
    _id: ObjectId,
    name: string,
    password: string,
    projects: ObjectId[]
}

const userSchema = new Schema<User>({
    name: {
        type: String,
        unique: true
    },
    password: String,
    projects: [Schema.Types.ObjectId]
})

const UserModel = model("User", userSchema)

export default UserModel