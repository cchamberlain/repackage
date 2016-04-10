#! /usr/bin/env node

import { argv } from 'yargs'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'



export default function transformPackage(packageTransformDir, packagePath) {
  readPaths(packageTransformDir).then(packageTransformPaths => {
    readJSON(packagePath).then(packageJSON => {
      let promises = Promise.all(packageTransformPaths.map(transformPath => readJSON(transformPath).then(transformJSON => [path.basename(transformPath, '.json'), transformJSON])))
      return promises.then(transforms => transforms.reduce((newPackageJSON, transform) => {
        let [key, transformJSON] = transform
        return Object.assign({}, newPackageJSON, { [key]: transformJSON })
      }, transformJSONs))
    })
  }).catch(err => { throw err })
}

const readPaths = dirPath => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if(err) reject(err)
      resolve(files)
    })
  })
}

const readJSON = jsonPath => {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonPath, 'utf8', (err, json) => {
      if(err) reject(err)
      resolve(JSON.parse(json))
    })
  })
}
