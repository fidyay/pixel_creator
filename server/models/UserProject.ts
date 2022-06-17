import { Schema, model, Document, ObjectId } from 'mongoose'

type CoordType = `x:${number};y:${number}`
type ColorType = `rgb(${number}, ${number}, ${number})` | 'transparent'

interface Frame {
    [key: CoordType]: ColorType
}

export interface UserProject extends Document {
    _id: string,
    name: string,
    background: string,
    widthInSquares: number,
    heightInSquares: number,
    type: string,
    author: ObjectId,
    frames: Frame[]
}

const userProjectSchema = new Schema<UserProject>({
    _id: String,
    name: String,
    author: Schema.Types.ObjectId,
    background: String,
    widthInSquares: Number,
    heightInSquares: Number,
    type: String,
    frames: Array
})

const UserProjectModel = model("UserProject", userProjectSchema)

export default UserProjectModel