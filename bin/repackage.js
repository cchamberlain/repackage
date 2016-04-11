#! /usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _chai = require('chai');

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usage = function usage(actual, message) {
  return 'usage: transform-package [path/to/transform/dir] [path/to/package.json] | you passed ' + JSON.stringify(actual) + ' | message: ' + message;
};
var args = _yargs.argv._;
var handleError = function handleError(message, err) {
  if (err) console.error(err, usage(args, message));else console.error(usage(args, message));
  process.exit(1);
};

var _args = _slicedToArray(args, 2);

var _args$ = _args[0];
var packageTransformDir = _args$ === undefined ? 'src/package' : _args$;
var _args$2 = _args[1];
var packagePath = _args$2 === undefined ? 'package.json' : _args$2;


var done = false;
(0, _lib2.default)(packageTransformDir, packagePath).then(function (message) {
  console.info(message);
  done = true;
}).catch(function (err) {
  console.error(handleError(err));
  done = true;
});
_deasync2.default.loopWhile(function () {
  return !done;
});