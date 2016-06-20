'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRepackage;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _systemjs = require('systemjs');

var _systemjs2 = _interopRequireDefault(_systemjs);

var _yargs = require('yargs');

var _chai = require('chai');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isWin = process.platform === 'win32';

function createRepackage(_ref) {
  var log = _ref.log;

  var loadNode = function loadNode(config, lib) {
    var libNode = lib.default || lib;
    return typeof libNode === 'function' ? libNode(_extends({ path: _path2.default, fs: _fs2.default }, config)) : libNode;
  };

  var transformNode = function transformNode(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2);

    var key = _ref3[0];
    var node = _ref3[1];

    if (key === 'scripts' && isWin) {
      return _defineProperty({}, key, Object.keys(node).map(function (scriptName) {
        return [scriptName, node[scriptName].replace(/NODE_ENV=([A-Za-z_-]+)/, 'set NODE_ENV=$1&&')];
      }).reduce(function (result, _ref4) {
        var _ref5 = _slicedToArray(_ref4, 2);

        var scriptName = _ref5[0];
        var script = _ref5[1];

        result[scriptName] = script;
        return result;
      }, {}));
    }
    return _defineProperty({}, key, node);
  };

  var readPaths = function readPaths(dirPath) {
    return new _bluebird2.default(function (resolve, reject) {
      _fs2.default.readdir(dirPath, function (err, files) {
        if (err) return reject(err);
        resolve(files.filter(function (x) {
          return x !== 'config.json';
        }).map(function (x) {
          return _path2.default.join(dirPath, x);
        }));
      });
    });
  };

  var readJSON = function readJSON(jsonPath, fallback) {
    return new _bluebird2.default(function (resolve, reject) {
      _fs2.default.readFile(jsonPath, 'utf8', function (err, json) {
        if (err) {
          if (fallback) return resolve(typeof fallback === 'function' ? fallback(err) : fallback);
          return reject(err);
        }
        resolve(JSON.parse(json));
      });
    });
  };

  var writeJSON = function writeJSON(jsonPath, json) {
    return new _bluebird2.default(function (resolve, reject) {
      _fs2.default.writeFile(jsonPath, JSON.stringify(json, null, 2), 'utf8', function (err) {
        if (err) return reject(err);
        resolve(jsonPath + ' saved successfully!');
      });
    });
  };

  var repackage = function repackage(packageTransformDir, packagePath) {
    //System.config({ transpiler: 'babel' })

    return readPaths(packageTransformDir).then(function (packageTransformPaths) {
      var imports = packageTransformPaths.filter(function (x) {
        return x.endsWith('.js');
      });
      return readJSON('.repackagerc', function () {
        log.warn('no .repackagerc found, bypassing use of author specific fields');
        return {};
      }).then(function (config) {
        return _bluebird2.default.all(imports.map(function (importPath) {
          return _systemjs2.default.import(importPath).then(function (lib) {
            return transformNode([_path2.default.basename(importPath, '.js'), loadNode(config, lib)]);
          });
        })).then(function (libs) {
          return Object.assign.apply(Object, [{}].concat(_toConsumableArray(libs)));
        }).then(function (packageFields) {
          return readJSON(packagePath).then(function (packageJSON) {
            return _bluebird2.default.all(packageTransformPaths.filter(function (x) {
              return x.endsWith('.json');
            }).map(function (transformPath) {
              return readJSON(transformPath).then(function (transformJSON) {
                return transformNode([_path2.default.basename(transformPath, '.json'), transformJSON]);
              });
            })).then(function (transforms) {
              return Object.assign.apply(Object, [{}, packageJSON].concat(_toConsumableArray(transforms), [packageFields]));
            }).then(function (packageUnsorted) {
              return writeJSON(packagePath, Object.keys(packageUnsorted).sort(function (a, b) {
                var sortBy = ['name', 'version', 'description', 'main', 'bin', 'files', 'keywords', 'scripts', 'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
                var indexOfA = sortBy.indexOf(a);
                var indexOfB = sortBy.indexOf(b);
                if (indexOfA !== -1 && indexOfB !== -1) {
                  if (indexOfA < indexOfB) return -1;
                  if (indexOfA > indexOfB) return 1;
                  return 0;
                }
                if (indexOfA !== -1) return -1;
                if (indexOfB !== -1) return 1;
                return a.localeCompare(b);
              }).reduce(function (obj, key) {
                obj[key] = packageUnsorted[key];
                return obj;
              }, {}));
            });
          });
        });
      }).catch(function (err) {
        throw err;
      });
    });
  };

  return repackage;
}