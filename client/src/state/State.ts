import { makeAutoObservable } from "mobx";

export type CoordType = `x:${number};y:${number}`
export type ColorType = `rgb(${number}, ${number}, ${number})` | 'transparent'

interface Frame {
    [key: CoordType]: ColorType
}

export type ProjectType = 'sprite' | 'image'

export interface Drawing {
    id: string,
    name: string,
    type: ProjectType,
    frames: Frame[],
    background: ColorType,
    widthInSquares: number,
    heightInSquares: number
}

class State {
    userName: string
    drawings: {
        [key: string]: Drawing
    }

    constructor() {
        this.drawings = {}
        this.userName = ''
        makeAutoObservable(this)
    }

    setUserName(name: string) {
        this.userName = name
    }

    clearState() {
        this.drawings = {}
        this.userName = ''
    }
 
    createDrawing(id: string, name: string, type: ProjectType, background: ColorType, widthInSquares: number, heightInSquares: number) {
        this.drawings[id] = {
            id,
            name,
            type,
            frames: [{}],
            background,
            widthInSquares,
            heightInSquares
        }
    }

    changeDrawingName(id: string, newName: string) {
        this.drawings[id].name = newName
    }

    createFrame(id: string) {
        this.drawings[id].frames.push({...this.drawings[id].frames[this.drawings[id].frames.length - 1]})
    }

    deleteFrame(id: string, index: number) {
        const newFramesArray: Frame[] = []
        this.drawings[id].frames.forEach((frame, frameIndex) => {
            if (frameIndex !== index) {
                newFramesArray.push(frame)
            }
        })
        this.drawings[id].frames = [...newFramesArray]
    }
}



export default State