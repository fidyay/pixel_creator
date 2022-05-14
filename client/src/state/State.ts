import { makeAutoObservable } from "mobx";

interface Frame {
    [key: string]: string
}

export interface Drawing {
    id: string,
    frames: Frame[],
    saved: boolean,
    background: string
}

class State {
    drawings: {
        [key: string]: Drawing
    }

    constructor() {
        this.drawings = {}
        makeAutoObservable(this)
    }

    createDrawing(id: string, background: string) {
        this.drawings[id] = {
            id,
            frames: [{}],
            saved: false,
            background
        }
    }

    createFrame(id: string) {
        this.drawings[id].frames.push({})
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