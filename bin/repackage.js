#! /usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chai = require('chai');

var _bunyan = require('bunyan');

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _bunyan.createLogger)({ name: 'repackage', level: 'info' });

var argv = _yargs2.default.usage('usage: $0 [init [options]] [options]').command('init', 'initialize repackage with transform directory and .repackagerc file', function (y) {
  return y.option('username', { alias: 'u', demand: true, describe: 'your github username' }).option('organization', { alias: 'o', demand: false, describe: 'your github organization (falls back to username)' }).option('full', { alias: 'f', demand: true, describe: 'your full name (e.g. John Smith)' }).option('email', { alias: 'e', demand: true, describe: 'your email' }).option('host', { alias: 'h', demand: false, describe: 'the host for your documentation: "github.io" OR "js.org"' });
}).alias('i', 'init').describe('i', 'initialize a source package directory').alias('t', 'transform').describe('t', 'relative path to package transform directory').alias('p', 'package').describe('p', 'relative path to package.json file').default({ t: 'src/package', p: 'package.json' }).help().strict().epilog('cheers from ' + new Date().year).argv;

if (argv.init) {
  var _argv$init = argv.init;
  var username = _argv$init.username;
  var organization = _argv$init.organization;
  var full = _argv$init.full;
  var email = _argv$init.email;
  var host = _argv$init.host;

  var repackagerc = { username: username, organization: organization, full: full, email: email, host: host };
  try {
    _fs2.default.writeFileSync('.repackagerc', JSON.stringify(repackagerc, null, 2), 'utf8');
  } catch (err) {
    if (err) {
      log.error(err, 'error during writing .repackagerc');
      _yargs2.default.showHelp();
      process.exit(1);
    }
  }
  process.exit(0);
}

var done = false;
var repackage = (0, _lib2.default)({ log: log });
repackage(argv.transform, argv.package).then(function (message) {
  log.info(message);
  done = true;
}).catch(function (err) {
  log.error(err, 'you may need to use repackage init [options]');
  _yargs2.default.showHelp();
  done = true;
});
_deasync2.default.loopWhile(function () {
  return !done;
});