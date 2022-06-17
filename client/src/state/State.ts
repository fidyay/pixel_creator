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

interface Drawings {
    [key: string]: Drawing
}

interface SavedOnline {
    [id: string]: string
}

class State {
    userName: string
    drawings: Drawings
    savedOnline: SavedOnline

    constructor() {
        this.drawings = {}
        this.userName = ''
        this.savedOnline = {}
        makeAutoObservable(this)
    }

    setUserName(name: string) {
        this.userName = name
    }

    clearState() {
        this.drawings = {}
        this.userName = ''
        this.savedOnline = {}
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

    setSavedOnline(drawing: Drawing) {
        this.savedOnline[drawing.id] = JSON.stringify(drawing)
    }

    isSavedOnline(id: string) {
        return !!this.savedOnline[id]
    }

    hasChanges(id: string) {
        if (!this.savedOnline[id]) return true
        if (JSON.stringify(this.drawings[id]) !== this.savedOnline[id]) return true
        return false
    }

    addProjectToState(drawing: Drawing) {
        this.drawings[drawing.id] = drawing
        this.savedOnline[drawing.id] = JSON.stringify(drawing)
    }

    deleteProject(id: string) {
        delete this.drawings[id]
        if (this.isSavedOnline(id)) delete this.savedOnline[id]
    }
}



export default State