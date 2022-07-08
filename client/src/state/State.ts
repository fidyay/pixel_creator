import { makeAutoObservable } from "mobx";

export type CoordType = `x:${number};y:${number}`
export type ColorType = `rgb(${number}, ${number}, ${number})` | 'transparent'

export interface Frame {
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

    restoreFrameState(drawingId: string, frameIndex: number, frameState: Frame) {
        this.drawings[drawingId].frames[frameIndex] = frameState
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
        this.drawings[id].frames.push({})
    }

    copyFrame(id: string, frameIndex: number) {
        this.drawings[id].frames.push({...this.drawings[id].frames[frameIndex]})
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

    changeFrameOrder(drawingId: string, frameIndex: number, toIndex: number) {
        const frames = this.drawings[drawingId].frames
        const elementOnIndex = {...frames[frameIndex]}
        const elementOnToIndex = {...frames[toIndex]}
        frames[toIndex] = elementOnIndex
        frames[frameIndex] = elementOnToIndex
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

    addProjectToStateFromImport(drawing: Drawing) {
        this.drawings[drawing.id] = drawing
    }

    deleteProject(id: string) {
        delete this.drawings[id]
        if (this.isSavedOnline(id)) delete this.savedOnline[id]
    }

    combineProjects(id: string, importedProject: Drawing) {
        this.drawings[id].frames.push(...importedProject.frames)
    }

    replaceProject(id: string, importedProject: Drawing) {
        this.drawings[id].frames = [...importedProject.frames]
    }
}



export default State