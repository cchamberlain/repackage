#! /usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chai = require('chai');

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.usage('usage: $0 <command> [options]').command('init', 'initialize repackage with transform directory and config file', function (y) {
  return y.option('u', { alias: 'username' }).option('o', { alias: 'organization' }).option('f', { alias: 'full' }).option('e', { alias: 'email' }).option('h', { alias: 'host' }).demand(['u', 'f', 'e', 'h']);
}).alias('i', 'init').describe('i', 'initialize a source package directory').alias('t', 'transform').describe('t', 'relative path to package transform directory').alias('p', 'package').describe('p', 'relative path to package.json file').default({ t: 'src/package', p: 'package.json' }).help().strict().epilog('cheers from ' + new Date().year).argv;

var usage = function usage(actual, message) {
  return 'usage: repackage [path/to/transform/dir] [path/to/package.json] | you passed ' + JSON.stringify(actual) + ' | message: ' + message;
};
var args = argv._;
var handleError = function handleError(message, err) {
  if (err) console.error(err, usage(args, message));else console.error(usage(args, message));
  process.exit(1);
};

var done = false;
(0, _lib2.default)(argv.transform, argv.package).then(function (message) {
  console.info(message);
  done = true;
}).catch(function (err) {

  console.error(err); //handleError(err))
  _yargs2.default.showHelp();
  done = true;
});
_deasync2.default.loopWhile(function () {
  return !done;
});