import { makeAutoObservable } from "mobx";

interface Frame {
    [key: string]: string
}

export type ProjectType = 'sprite' | 'image'

export interface Drawing {
    id: string,
    name: string,
    type: ProjectType,
    frames: Frame[],
    background: string,
    widthInSquares: number,
    heightInSquares: number
}

class State {
    drawings: {
        [key: string]: Drawing
    }

    constructor() {
        this.drawings = {}
        makeAutoObservable(this)
    }

    createDrawing(id: string, name: string, type: ProjectType, background: string, widthInSquares: number, heightInSquares: number) {
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