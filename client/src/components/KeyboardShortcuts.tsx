import React from "react";
import Button from "./Button";
import { useParams } from "react-router-dom";

const KeyboardShortcuts = () => {
    const { id } = useParams()
    return (
        <div className="modal">
            <div className="modal__window window__keyboard-shortcuts">
                <h1 className="window__keyboard-shortcuts__heading">Keyboard shortcuts</h1>
                <p className="window__keyboard-shortcuts__shortcut">1 - set pen size to 1</p>
                <p className="window__keyboard-shortcuts__shortcut">2 - set pen size to 2</p>
                <p className="window__keyboard-shortcuts__shortcut">3 - set pen size to 3</p>
                <p className="window__keyboard-shortcuts__shortcut">4 - set pen size to 4</p>
                <p className="window__keyboard-shortcuts__shortcut">P - pen</p>
                <p className="window__keyboard-shortcuts__shortcut">L - line</p>
                <p className="window__keyboard-shortcuts__shortcut">B - bucket</p>
                <p className="window__keyboard-shortcuts__shortcut">E - eraser</p>
                <p className="window__keyboard-shortcuts__shortcut">R - rectangle: Shift - to keep 1:1 ratio</p>
                <p className="window__keyboard-shortcuts__shortcut">C - circle: Shift - to keep 1:1 ratio</p>
                <p className="window__keyboard-shortcuts__shortcut">S - selection: Shift - to move, Ctrl + C and Ctrl + V - to copy and paste</p>
                <p className="window__keyboard-shortcuts__shortcut">O - pipette</p>
                <p className="window__keyboard-shortcuts__shortcut">Ctrl + Z and Ctrl + Y - to undo and redo</p>   
                <Button className="window__keyboard-shortcuts__button" link linkPath={`/workplace/${id}`}>Close</Button>             
            </div> 
        </div>
    )
}

export default KeyboardShortcuts
