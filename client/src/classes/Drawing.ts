import type { PenSizeType } from "../components/Workplace";
import type { Drawing as DrawingType, CoordType, ColorType } from "../state/State"

interface Squares {
    [key: CoordType]: ColorType | undefined
}

interface SelectedSquares {
    isDrawing: boolean,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    squares: Squares
}

class Drawing {
    private drawing: DrawingType
    private ctx?: CanvasRenderingContext2D
    private squareSize: number
    private penSize: PenSizeType
    private color: ColorType
    private chosenFrame: number
    public selectedSquares: SelectedSquares

    constructor() {
        this.selectedSquares = {
            isDrawing: false,
            xStart: 0,
            yStart: 0,
            xEnd: 0,
            yEnd: 0,
            squares: {}
        }
    }

    checkForPossibleCoordinate(square: string) {
        const coords = square.split(';')
        const X = Number(coords[0].slice(2))
        const Y = Number(coords[1].slice(2))
        if (X < 0) return false
        if (X > this.drawing.widthInSquares - 1) return false
        if (Y < 0) return false
        if (Y > this.drawing.heightInSquares - 1) return false
        return true
    }

    setDrawing(drawing: DrawingType) {
        this.drawing = drawing
    }

    setChosenFrame(n: number) {
        this.chosenFrame = n
    }

    getPixelCoord(coord: number) {
        return coord * this.squareSize
    }

    get canvasHeightInPixels() {
        return this.drawing.heightInSquares * this.squareSize
    }
    get canvasWidthInPixels() {
        return this.drawing.widthInSquares * this.squareSize
    }

    getSquareCoord(pixelCoord: number) {
        return Math.floor((pixelCoord)/(this.squareSize*this.penSize)) * this.penSize
    }

    getColorFromPixelCoords(x: number, y: number): string | null {
        const squareCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }
        if (this.drawing.frames[this.chosenFrame][`x:${squareCoords.x};y:${squareCoords.y}`]) {
            return this.drawing.frames[this.chosenFrame][`x:${squareCoords.x};y:${squareCoords.y}`]
        } 

        return null
    }

    setCTX(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    setSquareSize(n: number) {
        this.squareSize = n
    }

    setPenSize(s: PenSizeType) {
        this.penSize = s
    }

    setColor(c: ColorType) {
        this.color = c
    }

    drawBackground() {
        this.ctx.clearRect(0, 0, this.canvasWidthInPixels, this.canvasHeightInPixels)
        if (this.drawing.background !== 'transparent' && Object.values(this.drawing.frames[this.chosenFrame]).length === 0) {
            for (let i = 0; i < this.drawing.widthInSquares; i++) {
                for (let j = 0; j < this.drawing.heightInSquares; j++ ) {
                    this.drawing.frames[this.chosenFrame][`x:${i};y:${j}`] = this.drawing.background
                }
            }
        }
    }

    drawSquareFromName(name: string) {
        const coords = name.split(';')
        const X = Number(coords[0].slice(2))
        const Y = Number(coords[1].slice(2))
        this.ctx.clearRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
        this.ctx.fillRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
    }

    drawImage(n: number) {
        this.drawBackground()
        const frameObj = {...this.drawing.frames[this.chosenFrame]}
        const coordsOfSquares = Object.keys(frameObj)
        coordsOfSquares.forEach((square: CoordType) => {
            if (!this.checkForPossibleCoordinate(square)) {
                delete frameObj[square]
                this.drawing.frames[this.chosenFrame] = {...frameObj}
            }
            this.ctx.fillStyle = this.drawing.frames[n][square]
            this.drawSquareFromName(square)
        })
    }

    addAndDrawSquares(squaresToDraw: CoordType[]) {
        const frame = {...this.drawing.frames[this.chosenFrame]}
        squaresToDraw.forEach(square => {
            frame[square] = this.color
            this.drawSquareFromName(square)
        })
        this.drawing.frames[this.chosenFrame] = frame
    }

    drawSquare(x: number, y: number) {
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }
        const frame = {...this.drawing.frames[this.chosenFrame]}
        for (let i = 0; i < this.penSize; i++) {
            for (let j = 0; j < this.penSize; j++) {
                const coordX = startCoords.x + i
                const coordY = startCoords.y + j
                if (!frame[`x:${coordX};y:${coordY}`] || frame[`x:${coordX};y:${coordY}`] !== this.color) {
                    frame[`x:${coordX};y:${coordY}`] = this.color
                    this.ctx.clearRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    this.ctx.fillRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                }
            }
        }
        this.drawing.frames[this.chosenFrame] = {...frame}
    }
    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.drawImage(this.chosenFrame)
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        const squaresToDraw = new Set<CoordType>()

        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
            const isXStartBigger: boolean = startCoords.x > endCoords.x
            const isYStartBigger: boolean = startCoords.y > endCoords.y

            let XRange: number
            let YRange: number

            if (isXStartBigger) {
                XRange = startCoords.x - endCoords.x
            } else {
                XRange = endCoords.x - startCoords.x
            }

            if (isYStartBigger) {
                YRange = startCoords.y - endCoords.y
            } else {
                YRange = endCoords.y - startCoords.y
            }

            const isXRangeBigger: boolean = XRange > YRange

            let difXYRanges: number

            if (isXRangeBigger) {
                difXYRanges = YRange/XRange
            } else {
                difXYRanges = XRange/YRange
            }

            if (isXStartBigger && isYStartBigger) {
                for (let i = endCoords.x, j = endCoords.y;
                    i <= startCoords.x, j <= startCoords.y;
                    i = isXRangeBigger ? i + 1 : i + difXYRanges, j = isXRangeBigger ? j + difXYRanges : j + 1) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (!isXStartBigger && !isYStartBigger) {
                for (let i = endCoords.x, j = endCoords.y;
                    i >= startCoords.x, j >= startCoords.y;
                    i = isXRangeBigger ? i - 1 : i - difXYRanges, j = isXRangeBigger ? j - difXYRanges : j - 1) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (isXStartBigger && !isYStartBigger) {
                for (let i = endCoords.x, j = endCoords.y;
                    i <= startCoords.x, j >= startCoords.y;
                    i = isXRangeBigger ? i + 1 : i + difXYRanges, j = isXRangeBigger ? j - difXYRanges : j - 1) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (!isXStartBigger && isYStartBigger) {
                for (let i = endCoords.x, j = endCoords.y;
                    i >= startCoords.x, j <= startCoords.y;
                    i = isXRangeBigger ? i - 1 : i - difXYRanges, j = isXRangeBigger ? j + difXYRanges : j + 1) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
        }

        if (startCoords.x === endCoords.x && startCoords.y !== endCoords.y) {
            if (startCoords.y > endCoords.y) {
                for (let i = endCoords.x, j = endCoords.y;
                    j <= startCoords.y;
                    j++) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (startCoords.y < endCoords.y) {
                for (let i = endCoords.x, j = endCoords.y;
                    j >= startCoords.y;
                    j--) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
        }

        if (startCoords.x !== endCoords.x && startCoords.y === endCoords.y) {
            if (startCoords.x > endCoords.x) {
                for (let i = endCoords.x, j = endCoords.y;
                    i <= startCoords.x;
                    i++) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (startCoords.x < endCoords.x) {
                for (let i = endCoords.x, j = endCoords.y;
                    i >= startCoords.x;
                    i--) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = Math.floor(i) + k
                            const coordY = Math.floor(j) + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
        }

        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
            for (let i = 0; i < this.penSize; i++) {
                for (let j = 0; j < this.penSize; j++) {
                    squaresToDraw.add(`x:${startCoords.x + i};y:${startCoords.y + j}`)
                }
            }
        }
        const squaresToDrawArray = Array.from(squaresToDraw)
        squaresToDraw.forEach(square => {
            this.drawSquareFromName(square)
        })

        return squaresToDrawArray
    }

    areaFill(x: number, y: number) {
        this.ctx.fillStyle = this.color

        const startCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }

        const maxX = this.drawing.widthInSquares - 1
        const maxY = this.drawing.heightInSquares - 1

        const squaresToDraw = new Set<CoordType>()
        let targetColor: string
        if (this.drawing.frames[this.chosenFrame][`x:${startCoords.x};y:${startCoords.y}`]) {
            targetColor = this.drawing.frames[this.chosenFrame][`x:${startCoords.x};y:${startCoords.y}`]
        } else {
            // transparent
            targetColor = undefined
        }

        const addToSquaresToDraw = (square: CoordType) => {
            const squares = [square]
            let currentSquare = squares.shift()
          
            while (currentSquare) {
              let shouldBreak = false
            
              if (!targetColor) {
                if (this.drawing.frames[this.chosenFrame][currentSquare]) shouldBreak = true
              } else {
                if (targetColor !== this.drawing.frames[this.chosenFrame][currentSquare]) shouldBreak = true
              }
              const coords = currentSquare.split(";")
              const X = Number(coords[0].slice(2))
              const Y = Number(coords[1].slice(2))
          
              if (shouldBreak) {
                currentSquare = squares.shift()
                break
              }
          
              squaresToDraw.add(currentSquare)

            if (
                X - 1 >= 0 &&
                !squaresToDraw.has(`x:${X - 1};y:${Y}`) &&
                this.drawing.frames[this.chosenFrame][`x:${X - 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X - 1};y:${Y}`)
                squaresToDraw.add(`x:${X - 1};y:${Y}`)
                }

            if (
                Y - 1 >= 0 &&
                !squaresToDraw.has(`x:${X};y:${Y - 1}`) &&
                this.drawing.frames[this.chosenFrame][`x:${X};y:${Y - 1}`] === targetColor
                ) {
                squares.push(`x:${X};y:${Y - 1}`)
                squaresToDraw.add(`x:${X};y:${Y - 1}`)
                }

            if (
                X + 1 <= maxX &&
                !squaresToDraw.has(`x:${X + 1};y:${Y}`) &&
                this.drawing.frames[this.chosenFrame][`x:${X + 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X + 1};y:${Y}`)
                squaresToDraw.add(`x:${X + 1};y:${Y}`)
                }
            
            if (
                Y + 1 <= maxY &&
                !squaresToDraw.has(`x:${X};y:${Y + 1}`) &&
                this.drawing.frames[this.chosenFrame][`x:${X};y:${Y + 1}`] === targetColor
                ) {
                squares.push(`x:${X};y:${Y + 1}`)
                squaresToDraw.add(`x:${X};y:${Y + 1}`)
                }

              currentSquare = squares.shift()
            }
          }
          
        addToSquaresToDraw(`x:${startCoords.x};y:${startCoords.y}`)

        this.addAndDrawSquares(Array.from(squaresToDraw))
    }

    erase(x: number, y: number) { 
        const startCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }
        const newFrameObj = {...this.drawing.frames[this.chosenFrame]}
        for (let i = 0; i < this.penSize; i++) {
            for (let j = 0; j < this.penSize; j++) {
                const coordX = startCoords.x + i
                const coordY = startCoords.y + j
                if (newFrameObj[`x:${coordX};y:${coordY}`]) {
                    delete newFrameObj[`x:${coordX};y:${coordY}`]
                    this.ctx.clearRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    if (this.drawing.background !== 'transparent') {
                        this.ctx.fillStyle = this.drawing.background
                        this.ctx.fillRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    }
                }
            }
        }
        this.drawing.frames[this.chosenFrame] = {...newFrameObj}
    }

    rectangle(x1: number, y1: number, x2: number, y2: number, save1to1Ratio: boolean) {
        this.drawImage(this.chosenFrame)
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }

        if (save1to1Ratio) {
            const xDiff = Math.abs(startCoords.x - endCoords.x)
            const yDiff = Math.abs(startCoords.y - endCoords.y)

            if (xDiff > yDiff) {
                if (startCoords.x < endCoords.x) endCoords.x = startCoords.x + yDiff
                else if (startCoords.x > endCoords.x) endCoords.x = startCoords.x - yDiff
            } else if (xDiff < yDiff) {
                if (startCoords.y < endCoords.y) endCoords.y = startCoords.y + xDiff
                else if (startCoords.y > endCoords.y) endCoords.y = startCoords.y - xDiff
            }
        }

        const squaresToDraw = new Set<CoordType>()

        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
            const isXStartBigger: boolean = startCoords.x > endCoords.x
            const isYStartBigger: boolean = startCoords.y > endCoords.y

            if (isXStartBigger && isYStartBigger) {
                for (let i = endCoords.x; i <= startCoords.x; i++) {
                    for (let j = endCoords.y; j <= startCoords.y; j++) {
                        if (i === startCoords.x || i === endCoords.x || j === startCoords.y || j === endCoords.y) {
                            for (let k = 0; k < this.penSize; k++) {
                                for (let m = 0; m < this.penSize; m++) {
                                    const coordX = i + k
                                    const coordY = j + m
                                    squaresToDraw.add(`x:${coordX};y:${coordY}`)
                                }
                            }
                        }
                    }
                }
            }
            if (!isXStartBigger && !isYStartBigger) {
                for (let i = endCoords.x; i >= startCoords.x; i--) {
                    for (let j = endCoords.y; j >= startCoords.y; j--) {
                        if (i === startCoords.x || i === endCoords.x || j === startCoords.y || j === endCoords.y) {
                            for (let k = 0; k < this.penSize; k++) {
                                for (let m = 0; m < this.penSize; m++) {
                                    const coordX = i + k
                                    const coordY = j + m
                                    squaresToDraw.add(`x:${coordX};y:${coordY}`)
                                }
                            }
                        }
                    }
                }
            }
            if (isXStartBigger && !isYStartBigger) {
                for (let i = endCoords.x; i <= startCoords.x; i++) {
                    for (let j = endCoords.y; j >= startCoords.y; j--) {
                        if (i === startCoords.x || i === endCoords.x || j === startCoords.y || j === endCoords.y) {
                            for (let k = 0; k < this.penSize; k++) {
                                for (let m = 0; m < this.penSize; m++) {
                                    const coordX = i + k
                                    const coordY = j + m
                                    squaresToDraw.add(`x:${coordX};y:${coordY}`)
                                }
                            }
                        }
                    }
                }
            }
            if (!isXStartBigger && isYStartBigger) {
                for (let i = endCoords.x; i >= startCoords.x; i--) {
                    for (let j = endCoords.y; j <= startCoords.y; j++) {
                        if (i === startCoords.x || i === endCoords.x || j === startCoords.y || j === endCoords.y) {
                            for (let k = 0; k < this.penSize; k++) {
                                for (let m = 0; m < this.penSize; m++) {
                                    const coordX = i + k
                                    const coordY = j + m
                                    squaresToDraw.add(`x:${coordX};y:${coordY}`)
                                }
                            }
                        }
                    }
                }
            }
        }

        if (startCoords.x === endCoords.x && startCoords.y !== endCoords.y) {
            if (startCoords.y > endCoords.y) {
                for (let i = endCoords.x, j = endCoords.y;
                    j <= startCoords.y;
                    j++) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = i + k
                            const coordY = j + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (startCoords.y < endCoords.y) {
                for (let i = endCoords.x, j = endCoords.y;
                    j >= startCoords.y;
                    j--) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = i + k
                            const coordY = j + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
        }

        if (startCoords.x !== endCoords.x && startCoords.y === endCoords.y) {
            if (startCoords.x > endCoords.x) {
                for (let i = endCoords.x, j = endCoords.y;
                    i <= startCoords.x;
                    i++) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = i + k
                            const coordY = j + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
            if (startCoords.x < endCoords.x) {
                for (let i = endCoords.x, j = endCoords.y;
                    i >= startCoords.x;
                    i--) {
                    for (let k = 0; k < this.penSize; k++) {
                        for (let m = 0; m < this.penSize; m++) {
                            const coordX = i + k
                            const coordY = j + m
                            squaresToDraw.add(`x:${coordX};y:${coordY}`)
                        }
                    }
                }
            }
        }

        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
            for (let i = 0; i < this.penSize; i++) {
                for (let j = 0; j < this.penSize; j++) {
                    squaresToDraw.add(`x:${startCoords.x + i};y:${startCoords.y + j}`)
                }
            }
        }
        const squaresToDrawArray = Array.from(squaresToDraw)
        squaresToDraw.forEach(square => {
            this.drawSquareFromName(square)
        })

        return squaresToDrawArray
    }

    elipse(x1: number, y1: number, x2: number, y2: number, save1to1Ratio: boolean) {
        this.drawImage(this.chosenFrame)
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        
        if (save1to1Ratio) {
            const xDiff = Math.abs(startCoords.x - endCoords.x)
            const yDiff = Math.abs(startCoords.y - endCoords.y)

            if (xDiff > yDiff) {
                if (startCoords.x < endCoords.x) endCoords.x = startCoords.x + yDiff
                else if (startCoords.x > endCoords.x) endCoords.x = startCoords.x - yDiff
            } else if (xDiff < yDiff) {
                if (startCoords.y < endCoords.y) endCoords.y = startCoords.y + xDiff
                else if (startCoords.y > endCoords.y) endCoords.y = startCoords.y - xDiff
            }
        }

        let endCoordX = startCoords.x > endCoords.x ? startCoords.x : endCoords.x
        let endCoordY = startCoords.y > endCoords.y ? startCoords.y : endCoords.y

        if (endCoordX > this.drawing.widthInSquares - this.penSize) {
            if (startCoords.x > endCoords.x) {
                startCoords.x = this.drawing.widthInSquares - 1 - this.penSize
            } else {
                endCoords.x = this.drawing.widthInSquares - 1 - this.penSize
            }
        }

        if (endCoordY > this.drawing.heightInSquares - this.penSize) {
            if (startCoords.y > endCoords.y) {
                startCoords.y = this.drawing.widthInSquares - 1 - this.penSize
            } else {
                endCoords.y = this.drawing.widthInSquares - 1 - this.penSize
            }
        }

        const squaresToDraw = new Set<CoordType>()

        if (Math.abs(startCoords.x/this.penSize - endCoords.x/this.penSize) > 1 && Math.abs(startCoords.y/this.penSize - endCoords.y/this.penSize) > 1) {
            // x^2/a^2+y^2/b^2=1,a≥b>0
            const a = Math.abs(endCoords.x - startCoords.x)/2
            const b = Math.abs(endCoords.y - startCoords.y)/2

            const startX = startCoords.x > endCoords.x ? endCoords.x : startCoords.x
            const startY = startCoords.y > endCoords.y ? endCoords.y : startCoords.y

            for (let i = -a; i <= a; i++) {
                const Y = (Math.sqrt((1 - (i ** 2)/(a ** 2)) * b ** 2))
                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        squaresToDraw.add(`x:${startX + i + a + l};y:${startY + Math.floor(b - Y) + m}`)
                        squaresToDraw.add(`x:${startX + i + a + l};y:${startY + Math.ceil(b + Y) + m}`)
                    }
                }
            }

            for (let k = -b; k <= b; k++) {
                const X = (Math.sqrt((1 - (k ** 2)/(b ** 2)) * a ** 2))
                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        squaresToDraw.add(`x:${startX + Math.floor(a - X) + l};y:${startY + b + k + m}`)
                        squaresToDraw.add(`x:${startX + Math.ceil(a + X) + l};y:${startY + b + k + m}`)
                    }
                }
            }
        } else {
            for (let i = startCoords.x > endCoords.x ? endCoords.x : startCoords.x;
                i <= (startCoords.x > endCoords.x ? startCoords.x : endCoords.x);
                i++) {
                    for (let j = startCoords.y > endCoords.y ? endCoords.y : startCoords.y;
                        j <= (startCoords.y > endCoords.y ? startCoords.y : endCoords.y);
                        j++) {
                            for (let m = 0; m < this.penSize; m++) {
                                for (let n = 0; n < this.penSize; n++) {
                                    const coordX = i + m
                                    const coordY = j + n
                                    squaresToDraw.add(`x:${coordX};y:${coordY}`)
                                }
                            }
                        }
                }
        }

        squaresToDraw.forEach(square => {
            this.drawSquareFromName(square)
        })

        return Array.from(squaresToDraw)
    }

    selection(x1: number, y1: number, x2: number, y2: number) {
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        const squaresToSelect = new Set<string>()

        const xStartBigger = startCoords.x > endCoords.x
        const yStartBigger = startCoords.y > endCoords.y

        this.selectedSquares.xStart = xStartBigger ? endCoords.x : startCoords.x
        this.selectedSquares.yStart = yStartBigger ? endCoords.y : startCoords.y
        this.selectedSquares.xEnd = xStartBigger ? startCoords.x : endCoords.x
        this.selectedSquares.yEnd = yStartBigger ? startCoords.y : endCoords.y

        for (let i = startCoords.x > endCoords.x ? endCoords.x : startCoords.x;
            i <= (startCoords.x > endCoords.x ? startCoords.x : endCoords.x);
            i++) {
                for (let j = startCoords.y > endCoords.y ? endCoords.y : startCoords.y;
                    j <= (startCoords.y > endCoords.y ? startCoords.y : endCoords.y);
                    j++) {
                        squaresToSelect.add(`x:${i};y:${j}`)
                    }
            }

        const newSquaresObj: Squares = {}

        Array.from(squaresToSelect).forEach((square: CoordType) => {
            newSquaresObj[square] = undefined
        })

        this.selectedSquares.squares = newSquaresObj
    }

    resetSelectedSquares() {
        this.selectedSquares.squares = {}
        this.selectedSquares.isDrawing = false
        this.selectedSquares.xStart = 0
        this.selectedSquares.yStart = 0
        this.selectedSquares.xEnd = 0
        this.selectedSquares.yEnd = 0
    }

    moveSelection(x: number, y: number) {
        const coordsToMove = {
            x: Math.round((x)/(this.squareSize*this.penSize)) * this.penSize,
            y: Math.round((y)/(this.squareSize*this.penSize)) * this.penSize
        }
        const newSquareObj: Squares = {}
        Object.keys(this.selectedSquares.squares).forEach((square: CoordType) => {
            const coords = square.split(';')
            const squareX = Number(coords[0].slice(2)) - this.selectedSquares.xStart + coordsToMove.x
            const squareY = Number(coords[1].slice(2)) - this.selectedSquares.yStart + coordsToMove.y
            newSquareObj[`x:${squareX};y:${squareY}`] = this.selectedSquares.squares[square]
        })

        this.selectedSquares.squares = newSquareObj

        const xDiff = this.selectedSquares.xEnd - this.selectedSquares.xStart
        const yDiff = this.selectedSquares.yEnd - this.selectedSquares.yStart

        this.selectedSquares.xStart = coordsToMove.x
        this.selectedSquares.yStart = coordsToMove.y
        this.selectedSquares.xEnd = coordsToMove.x + xDiff
        this.selectedSquares.yEnd = coordsToMove.y + yDiff
    }

    fixSquaresToSelection(moving?: boolean) {
        if (!moving) {
            this.clearSelection()
        }
        const newSelectedSquaresObj: Squares = {...this.selectedSquares.squares}
        const keys = Object.keys(newSelectedSquaresObj)
        keys.forEach((square: CoordType) => {
            if (this.drawing.frames[this.chosenFrame][square]) {
                newSelectedSquaresObj[square] = this.drawing.frames[this.chosenFrame][square]
            }
        })
        this.selectedSquares.squares = newSelectedSquaresObj
        if (moving) {
            const newDrawingObj = {...this.drawing.frames[this.chosenFrame]}
            keys.forEach((key: CoordType) => {
                if (newSelectedSquaresObj[key]) {
                    delete newDrawingObj[key]
                }
            })
            this.drawing.frames[this.chosenFrame] = newDrawingObj
        }

        this.drawSelectedSquares()
    }

    placeSquaresFromSelection(moving?: boolean) {
        const newDrawingObj = {...this.drawing.frames[this.chosenFrame]}
        Object.keys(this.selectedSquares.squares).forEach((key: CoordType) => {
            if (this.selectedSquares.squares[key] && this.checkForPossibleCoordinate(key)) {
                newDrawingObj[key] = this.selectedSquares.squares[key]
            }
        })
        this.drawing.frames[this.chosenFrame] = newDrawingObj
        if (moving) {
            this.clearSelection()
        }

        this.drawSelectedSquares()
    }

    clearSelection() {
        const newSelectedSquaresObj = {...this.selectedSquares.squares}
        Object.keys(newSelectedSquaresObj).forEach((key: CoordType) => {
            newSelectedSquaresObj[key] = undefined
        })
        this.selectedSquares.squares = newSelectedSquaresObj
    }

    
    drawSelectedSquares() {
        if (Object.keys(this.selectedSquares.squares).length) {
            this.drawImage(this.chosenFrame)
            Object.keys(this.selectedSquares.squares).forEach((square: CoordType) => {
                if (this.selectedSquares.squares[square]) {
                    const color = this.selectedSquares.squares[square]
                    const rgb = color.slice(4, color.length - 1)
                    this.ctx.fillStyle = `rgba(${rgb}, .5)`
                } else {
                    this.ctx.fillStyle = 'rgba(130, 163, 178, .5)'
                }
                const coords = square.split(';')
                const X = Number(coords[0].slice(2))
                const Y = Number(coords[1].slice(2))
                this.ctx.fillRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
            })
        }
    }
}

export default Drawing