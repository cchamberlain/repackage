'use strict';

Object.defineProperty(exports, "__esModule", {
                              value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var target = ['src', '.'];

var clean = function clean() {
                              var targets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
                              return targets.map(function (x) {
                                                            return 'rimraf ' + x;
                              }).join(' && ');
};
var compile = function compile() {
                              var targets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
                              return targets.map(function (_ref) {
                                                            var _ref2 = _slicedToArray(_ref, 3);

                                                            var src = _ref2[0];
                                                            var dest = _ref2[1];
                                                            var _ref2$ = _ref2[2];
                                                            _ref2$ = _ref2$ === undefined ? {} : _ref2$;
                                                            var _ref2$$isDir = _ref2$.isDir;
                                                            var isDir = _ref2$$isDir === undefined ? true : _ref2$$isDir;
                                                            var _ref2$$watch = _ref2$.watch;
                                                            var watch = _ref2$$watch === undefined ? false : _ref2$$watch;
                                                            return 'babel ' + src + ' ' + (isDir ? '-d' : '-o') + ' ' + dest + (watch ? ' --watch' : '');
                              }).join(' && ');
};

exports.default = function () {
                              var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                              _objectDestructuringEmpty(_ref3);

                              return { 'clean': clean(['bin', 'lib']),
                                                            'prestart': 'npm run clean',
                                                            'start': compile([[].concat(target, [{ watch: true }])]),
                                                            'prebuild': 'npm run clean',
                                                            'build': compile([target]),
                                                            'predoc': clean(['doc']),
                                                            'doc': 'esdoc -c ./esdoc.json',
                                                            'prerelease': 'npm run build',
                                                            'release': 'npm version patch && npm publish',
                                                            'postrelease': 'npm run release-doc',
                                                            'prerelease-doc': 'npm run doc',
                                                            'release-doc': 'git subtree push --prefix doc origin gh-pages',
                                                            'postrelease-doc': 'git commit -am \"doc-release\" && git push --follow-tags',
                                                            'upgrade': 'ncu -a && npm update',
                                                            'test': 'karma start'
                              };
};