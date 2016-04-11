#! /usr/bin/env node

import path from 'path'
import yargs from 'yargs'
import { assert } from 'chai'
import deasync from 'deasync'
import transformPackage from '../lib'

let argv = yargs.usage('usage: $0 <command> [options]')
                .command('init', 'initialize package')
                .alias('i', 'init')
                .describe('i', 'initialize a source package directory')
                .command('transform', 'relative path to package transform directory', { })
                .epilog(`cheers from ${new Date().year}`)


const usage = (actual, message) => `usage: transform-package [path/to/transform/dir] [path/to/package.json] | you passed ${JSON.stringify(actual)} | message: ${message}`
const args = argv._
const handleError = (message, err) => {
  if(err) console.error(err, usage(args, message))
  else console.error(usage(args, message))
  process.exit(1)
}

let [packageTransformDir = 'src/package', packagePath = 'package.json']  = args

let done = false
transformPackage(packageTransformDir, packagePath)
  .then(message => {
    console.info(message)
    done = true
  })
  .catch(err => {
    console.error(handleError(err))
    done = true
  })
deasync.loopWhile(() => !done)
