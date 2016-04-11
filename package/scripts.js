'use strict';

Object.defineProperty(exports, "__esModule", {
                        value: true
});

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

exports.default = function (_ref) {
                        _objectDestructuringEmpty(_ref);

                        return { 'repackage': 'node bin/repackage -t src/package -p package.json',
                                                'prebuild': 'rimraf bin && rimraf lib',
                                                'build': 'babel src -d .',
                                                'watch': 'npm run build -- --watch',
                                                'predoc': 'rimraf doc',
                                                'doc': 'esdoc -c ./esdoc.json',
                                                'prerelease': 'npm run build',
                                                'release': 'npm version patch && npm publish',
                                                'postrelease': 'npm run release-doc',
                                                'prerelease-doc': 'npm run doc',
                                                'release-doc': 'git subtree push --prefix doc origin gh-pages',
                                                'postrelease-doc': 'git commit -am \"doc-release\" && git push --follow-tags',
                                                'test': 'karma start'
                        };
};