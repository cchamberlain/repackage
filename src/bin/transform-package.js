#! /usr/bin/env node

import { argv } from 'yargs'
import { assert } from 'chai'
import deasync from 'deasync'
import transformPackage from '../'

const usage = (actual, err) => `usage: transform <path/to/transform/dir> <package.json> | you passed ${JSON.stringify(actual)} | err: ${err}`

const args = argv.__
assert.ok(args, 'translate requires arguments')
assert(args.length === 2, usage(args))

const [packageTransformDir, packagePath]  = args
let done = false

transformPackage(packageTransformDir, packagePath)
  .then(message => {
    console.info(message)
    done = true
  })
  .catch(err => {
    console.error(usage(args, err))
    done = true
  })
deasync.loopWhile(() => !done)
