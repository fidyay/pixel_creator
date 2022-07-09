const fs = require('fs')
const path = require('path')

const inputPath = path.resolve('./.env')
const outputPath = path.resolve('../build/.env')

const inputStream = fs.createReadStream(inputPath)
const outputStream = fs.createWriteStream(outputPath)

inputStream.pipe(outputStream)