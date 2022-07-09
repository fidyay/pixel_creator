const fs = require('fs')
const path = require('path')

const buildPackageJSONPath = path.resolve('../build/package.json')
const serverPackageJSONPath = path.resolve('./package.json')

const buildPackageJSON = fs.readFileSync(buildPackageJSONPath)
const serverPackageJSON = fs.readFileSync(serverPackageJSONPath)

const buildPackage = JSON.parse(buildPackageJSON)
const serverPackage = JSON.parse(serverPackageJSON)

buildPackage.scripts.start = 'node index.js'

if (serverPackage.dependencies) buildPackage.dependencies = {...serverPackage.dependencies}

const newPackageJSON = JSON.stringify(buildPackage)

fs.writeFile(buildPackageJSONPath, newPackageJSON, (err) => {
    if (err) console.error(err)
    else console.log('Added start script to package.json')
})