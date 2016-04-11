#! /usr/bin/env node

import path from 'path'
import yargs from 'yargs'
import { assert } from 'chai'
import deasync from 'deasync'
import transformPackage from '../lib'

let argv = yargs.usage('usage: $0 <command> [options]')
                .command('init', 'initialize repackage with transform directory and config file', { username: { alias: 'u' } }
                                                                                                , { organization: { alias: 'o' } }
                                                                                                , { full: { alias: 'f' } }
                                                                                                , { email: { alias: 'e' } }
                                                                                                , { host: { alias: 'h', default: 'github.io' } })
                .alias('i', 'init')
                .describe('i', 'initialize a source package directory')
                .alias('t', 'transform')
                .describe('t', 'relative path to package transform directory')
                .alias('p', 'package')
                .describe('p', 'relative path to package.json file')
                .default({ t: 'src/package', p: 'package.json' })
                .help()
                .epilog(`cheers from ${new Date().year}`)
                .argv



const usage = (actual, message) => `usage: repackage [path/to/transform/dir] [path/to/package.json] | you passed ${JSON.stringify(actual)} | message: ${message}`
const args = argv._
const handleError = (message, err) => {
  if(err) console.error(err, usage(args, message))
  else console.error(usage(args, message))
  process.exit(1)
}


let done = false
transformPackage(argv.transform, argv.package)
  .then(message => {
    console.info(message)
    done = true
  })
  .catch(err => {
    console.error(handleError(err))
    done = true
  })
deasync.loopWhile(() => !done)
