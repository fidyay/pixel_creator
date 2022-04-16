import type { PenSizeType } from "../components/Workplace";

class Drawing {
    drawing: any
    private ctx?: CanvasRenderingContext2D
    private squareSize: number
    private penSize: PenSizeType
    private color: string

    constructor() {
        this.drawing = {}
    }

    getSquareCoord(pixelCoord: number) {
        return Math.floor((pixelCoord)/(this.squareSize*this.penSize)) * this.penSize
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

    drawImage() {
        const coordsOfSquares = this.drawing.keys()
        coordsOfSquares.forEach((square: string) => {
            this.ctx.fillStyle = this.drawing[square]
            const coords = square.split(';')
            const X = Number(coords[0].slice(2))
            const Y = Number(coords[1].slice(2))
            this.ctx.fillRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
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
                    this.ctx.fillRect(coordX * this.squareSize, coordY * this.squareSize, this.squareSize, this.squareSize)
                }
            }
        }
    }
    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.fillStyle = this.color
        console.log(x1, y1, x2, y2)
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
                    i < startCoords.x, j < startCoords.y;
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
                    i > startCoords.x, j > startCoords.y;
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
                    i < startCoords.x, j > startCoords.y;
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
                    i > startCoords.x, j < startCoords.y;
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
        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
            for (let i = 0; i < this.penSize; i++) {
                for (let j = 0; j < this.penSize; j++) {
                    squaresToDraw.add(`x:${startCoords.x + i};y:${startCoords.y + j}`)
                }
            }
        }
        const squaresToDrawArray = Array.from(squaresToDraw)
        squaresToDraw.forEach(square => {
            const coords = square.split(';')
            const X = Number(coords[0].slice(2))
            const Y = Number(coords[1].slice(2))
            this.ctx.fillRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
        })

        return squaresToDrawArray
    }

    selectArea(x1: number, y1: number, x2: number, y2: number) {
        // for future and needs a rework
        // copy the loops from drawLine method and change them to the appropriate way
        this.ctx.fillStyle = this.color
        console.log(x1, y1, x2, y2)
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

            for (let i = isXStartBigger ? endCoords.x : startCoords.x; i < (isXStartBigger ? startCoords.x : endCoords.x); i = isXRangeBigger ? i + 1 : i + difXYRanges) {
                for (let j = isYStartBigger ? endCoords.y : startCoords.y; j < (isYStartBigger ? startCoords.y : endCoords.y); j = isXRangeBigger ? j + difXYRanges : j + 1) {
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
            const coords = square.split(';')
            const X = Number(coords[0].slice(2))
            const Y = Number(coords[1].slice(2))
            this.ctx.fillRect(X * this.squareSize, Y * this.squareSize, this.squareSize, this.squareSize)
        })

        return squaresToDrawArray
    }
}

export default Drawing