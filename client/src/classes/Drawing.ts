import type { PenSizeType } from "../components/Workplace";

const trasparentBgSquareSize = 6

class Drawing {
    drawing: any
    private ctx?: CanvasRenderingContext2D
    private squareSize: number
    private penSize: PenSizeType
    private color: string
    private background: string
    private canvasWidthInSquares: number
    private canvasHeightInSquares: number

    constructor() {
        this.drawing = {}
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
        if (this.background === 'transparent') {
            let fourTransparentSquaresWidth = Math.ceil(this.canvasWidthInPixels/(2*trasparentBgSquareSize))
            let fourTransparentSquaresHeight = Math.ceil(this.canvasHeightInPixels/(2*trasparentBgSquareSize))
            for (let i = 0; i < fourTransparentSquaresWidth; i++) {
                for (let j = 0; j < fourTransparentSquaresHeight; j++) {
                    for (let k = 0, m = 0; k < 2; k++, m++) {
                        for (let l = 0; l < 2; l++, m++) {
                            this.ctx.fillStyle = (m % 2 === 0) ? '#555555' : '#4c4c4c'
                            this.ctx.fillRect(i * 2 * trasparentBgSquareSize + k * trasparentBgSquareSize, j * 2 * trasparentBgSquareSize + l * trasparentBgSquareSize, trasparentBgSquareSize, trasparentBgSquareSize)
                        }
                    }
                }
            }
        }
    }

    drawSquareFromName(name: string) {
        const coords = name.split(';')
        const X = Number(coords[0].slice(2))
        const Y = Number(coords[1].slice(2))
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
        const startCoords = {
            x: this.getSquareCoord(x),
            y: this.getSquareCoord(y)
        }

        const maxX = this.canvasWidthInSquares - 1
        const maxY = this.canvasHeightInSquares - 1

        const squaresToDraw: string[] = []
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
          
            //   if (squaresToDraw.includes(currentSquare)) {
            //       console.log('its here')
            //       shouldBreak = true
            //   }
              if (!targetColor) {
                if (this.drawing[currentSquare]) shouldBreak = true
              } else {
                if (targetColor !== this.drawing[currentSquare]) shouldBreak = true
              }
              const coords = currentSquare.split(";")
              const X = Number(coords[0].slice(2))
              const Y = Number(coords[1].slice(2))
          
            //   if (X < 0 || Y < 0 || X > maxX || Y > maxX) shouldBreak = true
          
              if (shouldBreak) {
                currentSquare = squares.shift()
                break
              }
          
              squaresToDraw.push(currentSquare)

            if (
                X - 1 >= 0 &&
                !squaresToDraw.includes(`x:${X - 1};y:${Y}`) &&
                this.drawing[`x:${X - 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X - 1};y:${Y}`)
                squaresToDraw.push(`x:${X - 1};y:${Y}`)
                }

            if (
                Y - 1 >= 0 &&
                !squaresToDraw.includes(`x:${X};y:${Y - 1}`) &&
                this.drawing[`x:${X};y:${Y - 1}`] === targetColor
                ) {
                squares.push(`x:${X};y:${Y - 1}`)
                squaresToDraw.push(`x:${X};y:${Y - 1}`)
                }

            if (
                X + 1 <= maxX &&
                !squaresToDraw.includes(`x:${X + 1};y:${Y}`) &&
                this.drawing[`x:${X + 1};y:${Y}`] === targetColor
                ) {
                squares.push(`x:${X + 1};y:${Y}`)
                squaresToDraw.push(`x:${X + 1};y:${Y}`)
                }
            
            if (
                Y + 1 <= maxY &&
                !squaresToDraw.includes(`x:${X};y:${Y + 1}`) &&
                this.drawing[`x:${X};y:${Y + 1}`] === targetColor
                ) {
                squares.push(`x:${X};y:${Y + 1}`)
                squaresToDraw.push(`x:${X};y:${Y + 1}`)
                }

              currentSquare = squares.shift()
            }
          }
          

        // const addToSquaresToDraw = (square: string) => {
        //     if (squaresToDraw.includes(square)) return
        //     if (!targetColor) {
        //         if (this.drawing[square]) return
        //     } else {
        //         if (targetColor !== this.drawing[square]) return
        //     }
        //     const coords = square.split(';')
        //     const X = Number(coords[0].slice(2))
        //     const Y = Number(coords[1].slice(2))

        //     if (X < 0) return
        //     if (Y < 0) return
        //     if (X > maxX) return
        //     if (Y > maxY) return

        //     squaresToDraw.push(square)
        //     if (!squaresToDraw.includes(`x:${X - 1};y:${Y}`) && this.drawing[`x:${X - 1};y:${Y}`] === targetColor) {
        //         addToSquaresToDraw(`x:${X - 1};y:${Y}`)
        //     }
        //     if (!squaresToDraw.includes(`x:${X};y:${Y - 1}`) && this.drawing[`x:${X};y:${Y - 1}`] === targetColor) {
        //         addToSquaresToDraw(`x:${X};y:${Y - 1}`)
        //     }
        //     if (!squaresToDraw.includes(`x:${X + 1};y:${Y}`) && this.drawing[`x:${X + 1};y:${Y}`] === targetColor) {
        //         addToSquaresToDraw(`x:${X + 1};y:${Y}`)
        //     }
        //     if (!squaresToDraw.includes(`x:${X};y:${Y + 1}`) && this.drawing[`x:${X};y:${Y + 1}`] === targetColor) {
        //         addToSquaresToDraw(`x:${X};y:${Y + 1}`)
        //     }
        // }
        addToSquaresToDraw(`x:${startCoords.x};y:${startCoords.y}`)

        this.addAndDrawSquares(squaresToDraw)
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
            this.drawSquareFromName(square)
        })

        return squaresToDrawArray
    }
}

export default Drawing