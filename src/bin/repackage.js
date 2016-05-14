#! /usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'
import { assert } from 'chai'
import { createLogger } from 'bunyan'
import deasync from 'deasync'
import createRepackage from '../lib'

const log = createLogger({ name: 'repackage', level: 'info' })

let argv = yargs.usage('usage: $0 [init [options]] [options]')
                .command('init', 'initialize repackage with transform directory and .repackagerc file', y => y.option('username', { alias: 'u', demand: true, describe: 'your github username' })
                                                                                                              .option('organization', { alias: 'o', demand: false, describe: 'your github organization (falls back to username)' })
                                                                                                              .option('full', { alias: 'f', demand: true, describe: 'your full name (e.g. John Smith)' })
                                                                                                              .option('email', { alias: 'e', demand: true, describe: 'your email' })
                                                                                                              .option('host', { alias: 'h', demand: false, describe: 'the host for your documentation: "github.io" OR "js.org"' }))

                .alias('i', 'init')
                .describe('i', 'initialize a source package directory')
                .alias('t', 'transform')
                .describe('t', 'relative path to package transform directory')
                .alias('p', 'package')
                .describe('p', 'relative path to package.json file')
                .default({ t: 'src/package', p: 'package.json' })
                .help()
                .strict()
                .epilog(`cheers from ${new Date().year}`)
                .argv


if(argv.init) {
  let { username, organization, full, email, host } = argv.init
  let repackagerc = { username, organization, full, email, host }
  try {
    fs.writeFileSync('.repackagerc', JSON.stringify(repackagerc, null, 2), 'utf8')
  } catch(err) {
    if(err) {
      log.error(err, 'error during writing .repackagerc')
      yargs.showHelp()
      process.exit(1)
    }
  }
  process.exit(0)
}


let done = false
const repackage = createRepackage({ log })
repackage(argv.transform, argv.package)
  .then(message => {
    log.info(message)
    done = true
  })
  .catch(err => {
    log.error(err, 'you may need to use repackage init [options]')
    yargs.showHelp()
    done = true
  })
deasync.loopWhile(() => !done)
