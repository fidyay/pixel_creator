import { Schema, model, Document, ObjectId } from 'mongoose'

type CoordType = `x:${number};y:${number}`
type ColorType = `rgb(${number}, ${number}, ${number})` | 'transparent'

interface Frame {
    [key: CoordType]: ColorType
}

export interface UserProject extends Document {
    _id: ObjectId,
    name: string,
    background: string,
    widthInSquares: number,
    heightInSquares: number,
    type: string,
    author: ObjectId,
    frames: Frame[]
}

const userProjectSchema = new Schema<UserProject>({
    name: String,
    author: Schema.Types.ObjectId,
    background: String,
    widthInSquares: String,
    heightInSquares: String,
    type: String,
    frames: Array
})

const UserProjectModel = model("UserProject", userProjectSchema)

export default UserProjectModel