import type { PenSizeType } from "../components/Workplace";

interface Squares {
    [key: string]: string | undefined
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
    drawing: any
    private ctx?: CanvasRenderingContext2D
    private squareSize: number
    private penSize: PenSizeType
    private color: string
    private background: string
    private canvasWidthInSquares: number
    private canvasHeightInSquares: number
    public selectedSquares: SelectedSquares

    constructor() {
        this.drawing = {}
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
        if (X > this.canvasWidthInSquares - 1) return false
        if (Y < 0) return false
        if (Y > this.canvasHeightInSquares - 1) return false
        return true
    }

    getPixelCoord(coord: number) {
        return coord * this.squareSize
    }

    setBackground(b: string) {
        this.background = b
    }

    setCanvasSize(h: number, w: number) {
        this.canvasHeightInSquares = h
        this.canvasWidthInSquares = w
    }

    get canvasHeightInPixels() {
        return this.canvasHeightInSquares * this.squareSize
    }
    get canvasWidthInPixels() {
        return this.canvasWidthInSquares * this.squareSize
    }

    getSquareCoord(pixelCoord: number) {
        return Math.floor((pixelCoord)/(this.squareSize*this.penSize)) * this.penSize
    }

    getColorFromPixelCoords(x: number, y: number): string | null {
        const squareCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }
        if (this.drawing[`x:${squareCoords.x};y:${squareCoords.y}`]) {
            return this.drawing[`x:${squareCoords.x};y:${squareCoords.y}`]
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

    setColor(c: string) {
        this.color = c
    }

    drawBackground() {
        this.ctx.clearRect(0, 0, this.canvasWidthInPixels, this.canvasHeightInPixels)
        if (this.background !== 'transparent' && Object.values(this.drawing).length === 0) {
            for (let i = 0; i < this.canvasWidthInSquares; i++) {
                for (let j = 0; j < this.canvasHeightInSquares; j++ ) {
                    this.drawing[`x:${i};y:${j}`] = this.background
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

    drawImage() {
        this.drawBackground()
        const coordsOfSquares = Object.keys(this.drawing)
        coordsOfSquares.forEach((square: string) => {
            this.ctx.fillStyle = this.drawing[square]
            this.drawSquareFromName(square)
        })
    }

    addAndDrawSquares(squaresToDraw: string[]) {
        squaresToDraw.forEach(square => {
            this.drawing[square] = this.color
            this.drawSquareFromName(square)
        })
    }

    drawSquare(x: number, y: number) {
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }
        for (let i = 0; i < this.penSize; i++) {
            for (let j = 0; j < this.penSize; j++) {
                const coordX = startCoords.x + i
                const coordY = startCoords.y + j
                if (!this.drawing[`x:${coordX};y:${coordY}`] || this.drawing[`x:${coordX};y:${coordY}`].color !== this.color) {
                    this.drawing[`x:${coordX};y:${coordY}`] = this.color
                    this.ctx.clearRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    this.ctx.fillRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                }
            }
        }
    }
    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.drawImage()
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        const squaresToDraw = new Set<string>()

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

        const maxX = this.canvasWidthInSquares - 1
        const maxY = this.canvasHeightInSquares - 1

        const squaresToDraw = new Set<string>()
        let targetColor: string
        if (this.drawing[`x:${startCoords.x};y:${startCoords.y}`]) {
            targetColor = this.drawing[`x:${startCoords.x};y:${startCoords.y}`]
        } else {
            // transparent
            targetColor = undefined
        }

        const addToSquaresToDraw = (square: string) => {
            const squares = [square]
            let currentSquare = squares.shift()
          
            while (currentSquare) {
              let shouldBreak = false
            
              if (!targetColor) {
                if (this.drawing[currentSquare]) shouldBreak = true
              } else {
                if (targetColor !== this.drawing[currentSquare]) shouldBreak = true
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
                this.drawing[`x:${X - 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X - 1};y:${Y}`)
                squaresToDraw.add(`x:${X - 1};y:${Y}`)
                }

            if (
                Y - 1 >= 0 &&
                !squaresToDraw.has(`x:${X};y:${Y - 1}`) &&
                this.drawing[`x:${X};y:${Y - 1}`] === targetColor
                ) {
                squares.push(`x:${X};y:${Y - 1}`)
                squaresToDraw.add(`x:${X};y:${Y - 1}`)
                }

            if (
                X + 1 <= maxX &&
                !squaresToDraw.has(`x:${X + 1};y:${Y}`) &&
                this.drawing[`x:${X + 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X + 1};y:${Y}`)
                squaresToDraw.add(`x:${X + 1};y:${Y}`)
                }
            
            if (
                Y + 1 <= maxY &&
                !squaresToDraw.has(`x:${X};y:${Y + 1}`) &&
                this.drawing[`x:${X};y:${Y + 1}`] === targetColor
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
        for (let i = 0; i < this.penSize; i++) {
            for (let j = 0; j < this.penSize; j++) {
                const coordX = startCoords.x + i
                const coordY = startCoords.y + j
                if (this.drawing[`x:${coordX};y:${coordY}`] && this.drawing[`x:${coordX};y:${coordY}`] !== this.background) {
                    if (this.background === 'tranparent') {
                        delete this.drawing[`x:${coordX};y:${coordY}`]
                        this.ctx.clearRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    } else {
                        this.ctx.fillStyle = this.background
                        this.drawing[`x:${coordX};y:${coordY}`] = this.background
                        this.ctx.clearRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                        this.ctx.fillRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                    }
                }
            }
        }
    }

    rectangle(x1: number, y1: number, x2: number, y2: number) {
        this.drawImage()
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        const squaresToDraw = new Set<string>()

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

    elipse(x1: number, y1: number, x2: number, y2: number) {
        this.drawImage()
        this.ctx.fillStyle = this.color
        const startCoords = {
            x: this.getSquareCoord(x1),
            y: this.getSquareCoord(y1)
        }
        const endCoords = {
            x: this.getSquareCoord(x2),
            y: this.getSquareCoord(y2)
        }
        const squaresToDraw = new Set<string>()

        if (Math.abs(startCoords.x/this.penSize - endCoords.x/this.penSize) > 1 && Math.abs(startCoords.y/this.penSize - endCoords.y/this.penSize) > 1) {
            // x^2/a^2+y^2/b^2=1,a≥b>0
            const a = (startCoords.x > endCoords.x ? startCoords.x - endCoords.x : endCoords.x - startCoords.x)/2
            const b = (startCoords.y > endCoords.y ? startCoords.y - endCoords.y : endCoords.y - startCoords.y)/2

            const zeroX = Math.floor(startCoords.x > endCoords.x ? startCoords.x - a : endCoords.x - a)
            const zeroY = Math.floor(startCoords.y > endCoords.y ? startCoords.y - b : endCoords.y - b)
            
            for (let i = 0; i <= a; i++) {
                const y = Math.ceil(Math.sqrt((1 - (i ** 2)/(a ** 2)) * (b ** 2)))

                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        const coordX = zeroX + i + l
                        const coordY = zeroY + y + m
                        squaresToDraw.add(`x:${coordX};y:${coordY}`)
                    }
                }

                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        const coordX = zeroX - i + l
                        const coordY = zeroY + y + m
                        squaresToDraw.add(`x:${coordX};y:${coordY}`)
                    }
                }

                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        const coordX = zeroX + i + l
                        const coordY = zeroY - y + m
                        squaresToDraw.add(`x:${coordX};y:${coordY}`)
                    }
                }

                for (let l = 0; l < this.penSize; l++) {
                    for (let m = 0; m < this.penSize; m++) {
                        const coordX = zeroX - i + l
                        const coordY = zeroY - y + m
                        squaresToDraw.add(`x:${coordX};y:${coordY}`)
                    }
                }

                if (!(squaresToDraw.has(`x:${zeroX + i - 1};y:${zeroY + y}`) || squaresToDraw.has(`x:${zeroX + i - 1};y:${zeroY + y + 1}`))) {
                    const previousY =  Math.ceil(Math.sqrt((1 - ((i - 1) ** 2)/(a ** 2)) * (b ** 2)))
                    for (let k = y; k < previousY; k++) {
                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX + i + l
                                const coordY = zeroY - k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }

                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX - i + l
                                const coordY = zeroY - k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }

                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX + i + l
                                const coordY = zeroY + k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }

                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX - i + l
                                const coordY = zeroY + k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }
                    }
                }

                if (i === Math.floor(a)) {
                    const previousY =  Math.ceil(Math.sqrt((1 - (Math.floor(a - 1) ** 2)/(a ** 2)) * (b ** 2)))
                    for (let k = zeroY - previousY + 1; k < zeroY + previousY; k++) {
                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX + i + l
                                const coordY = k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }

                        for (let l = 0; l < this.penSize; l++) {
                            for (let m = 0; m < this.penSize; m++) {
                                const coordX = zeroX - i + l
                                const coordY = k + m
                                squaresToDraw.add(`x:${coordX};y:${coordY}`)
                            }
                        }
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

        const squaresToDrawArray = Array.from(squaresToDraw)
        squaresToDraw.forEach(square => {
            this.drawSquareFromName(square)
        })

        return squaresToDrawArray
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

        Array.from(squaresToSelect).forEach(square => {
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
        Object.keys(this.selectedSquares.squares).forEach(square => {
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
        keys.forEach(square => {
            if (this.drawing[square]) {
                newSelectedSquaresObj[square] = this.drawing[square]
            }
        })
        this.selectedSquares.squares = newSelectedSquaresObj
        if (moving) {
            const newDrawingObj = {...this.drawing}
            keys.forEach(key => {
                if (newSelectedSquaresObj[key]) {
                    delete newDrawingObj[key]
                }
            })
            this.drawing = newDrawingObj
        }

        this.drawSelectedSquares()
    }

    placeSquaresFromSelection(moving?: boolean) {
        const newDrawingObj = {...this.drawing}
        Object.keys(this.selectedSquares.squares).forEach(key => {
            if (this.selectedSquares.squares[key] && this.checkForPossibleCoordinate(key)) {
                newDrawingObj[key] = this.selectedSquares.squares[key]
            }
        })
        this.drawing = newDrawingObj
        if (moving) {
            this.clearSelection()
        }

        this.drawSelectedSquares()
    }

    clearSelection() {
        const newSelectedSquaresObj = {...this.selectedSquares.squares}
        Object.keys(newSelectedSquaresObj).forEach(key => {
            newSelectedSquaresObj[key] = undefined
        })
        this.selectedSquares.squares = newSelectedSquaresObj
    }

    
    drawSelectedSquares() {
        if (Object.keys(this.selectedSquares.squares).length) {
            this.drawImage()
            Object.keys(this.selectedSquares.squares).forEach(square => {
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