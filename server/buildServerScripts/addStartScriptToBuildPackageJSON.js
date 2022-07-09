const fs = require('fs')
const path = require('path')

const buildPackageJSONPath = path.resolve('../build/package.json')

const buildPackageJSON = fs.readFileSync(buildPackageJSONPath)

const buildPackage = JSON.parse(buildPackageJSON)

buildPackage.scripts.start = 'node index.js'

const newPackageJSON = JSON.stringify(buildPackage)

fs.writeFile(buildPackageJSONPath, newPackageJSON, (err) => {
    if (err) console.error(err)
    else console.log('Added start script to package.json')
})