#! /usr/bin/env node

import { argv } from 'yargs'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'
import System from 'systemjs'

const isWin = process.platform === 'win32'

export default function transformPackage(packageTransformDir, packagePath) {
  return readPaths(packageTransformDir).then(packageTransformPaths => {
    let imports = packageTransformPaths.filter(x => x.endsWith('.js'))
    return readJSON('package.config.json').then(config => {
      return Promise.all(imports.map(importPath => System.import(importPath).then(lib => transformNode([path.basename(importPath, '.js'), loadNode(config, lib)]))))
                    .then(libs => Object.assign({}, ...libs))
                    .then(packageFields => {
                        return readJSON(packagePath).then(packageJSON => {
                          return Promise.all(packageTransformPaths.filter(x => x.endsWith('.json')).map(transformPath => {
                            return readJSON(transformPath).then(transformJSON => transformNode([path.basename(transformPath, '.json'), transformJSON]))
                          }))
                          .then(transforms => Object.assign({}, packageJSON, ...transforms, packageFields))
                          .then(packageUnsorted => writeJSON(packagePath, Object.keys(packageUnsorted).sort((a, b) => {
                            const sortBy = ['name', 'version', 'description', 'main', 'bin', 'files', 'keywords', 'scripts', 'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
                            let indexOfA = sortBy.indexOf(a)
                            let indexOfB = sortBy.indexOf(b)
                            if(indexOfA !== -1 && indexOfB !== -1) {
                              if(indexOfA < indexOfB)
                                return -1
                              if(indexOfA > indexOfB)
                                return 1
                              return 0
                            }
                            if(indexOfA !== -1)
                              return -1
                            if(indexOfB !== -1)
                              return 1
                            return a.localeCompare(b)
                          }).reduce((obj, key) => {
                            obj[key] = packageUnsorted[key]
                            return obj
                          }, {})))
                        })
                      })
                    }).catch(err =>{ throw err }) //new Error('No package.config.json found. Add one to your project root as specified at https://transform-package.js.org'))
    })
}

const loadNode = (config, lib) => {
  let libNode = lib.default || lib
  return typeof libNode === 'function' ? libNode(config) : libNode
}


const transformNode = ([key, node]) => {
  if(key === 'scripts' && isWin) {
    return  { [key]: Object.keys(node)
                          .map(scriptName => ([scriptName, node[scriptName].replace(/NODE_ENV=([A-Za-z_-]+)/, 'set NODE_ENV=$1&&')]))
                          .reduce((result, [scriptName, script]) => {
                            result[scriptName] = script
                            return result
                          }, {})
            }
  }
  return { [key]: node }
}

const readPaths = dirPath => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if(err) return reject(err)
      resolve(files.filter(x => x !== 'config.json').map(x => path.join(dirPath, x)))
    })
  })
}

const readJSON = jsonPath => {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonPath, 'utf8', (err, json) => {
      if(err) return reject(err)
      resolve(JSON.parse(json))
    })
  })
}

const writeJSON = (jsonPath, json) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonPath, JSON.stringify(json, null, 2), 'utf8', (err) => {
      if(err) return reject(err)
      resolve(`${jsonPath} saved successfully!`)
    })
  })
}
