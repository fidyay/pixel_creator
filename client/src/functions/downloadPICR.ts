import type { Drawing } from "../state/State";

const downloadPICR = (drawing: Drawing) => {
    const link = document.createElement('a')
    const fileName = `${drawing.name}.picr`
    const file = new Blob([JSON.stringify(drawing)])
    link.download = fileName
    link.href = URL.createObjectURL(file)
    link.click()
}

export default downloadPICR