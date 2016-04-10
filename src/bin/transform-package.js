#! /usr/bin/env node

import { argv }from 'yargs'
import { assert } from 'chai'
import deasync from 'deasync'
import transformPackage from '../lib'


const usage = actual => `usage: transform-package <path/to/transform/dir> <package.json> | you passed ${JSON.stringify(actual)}`
const args = argv._
const handleError = err => {
  if(err)
    console.error(err, usage(args))
  else
    console.error(usage(args))
  process.exit(1)
}

if(!args)
  handleError(new Error('No args passed.'))
if(args.length > 2)
  handleError(new Error('Too many args passed.'))

const [packageTransformDir, packagePath]  = args
let done = false
transformPackage(packageTransformDir, packagePath || 'package.json')
  .then(message => {
    console.info(message)
    done = true
  })
  .catch(err => {
    console.error(handleError(err))
    done = true
  })
deasync.loopWhile(() => !done)
