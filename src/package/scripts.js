const target = ['src', '.']

const clean = (targets = []) => targets.map(x => `rimraf ${x}`).join(' && ')
const babel = (targets = []) => targets.map(([src, dest, { isDir = true, watch = false } = {}]) => `babel ${src} ${isDir ? '-d' : '-o'} ${dest}${watch ? ' --watch' : ''}`).join(' && ')

export default ({} = {}) => ( { 'clean': clean(['bin', 'lib'])
                              , 'prestart': 'npm run clean'
                              , 'start': babel([[...target, { watch: true }]])
                              , 'prebuild': 'npm run clean'
                              , 'build': babel([target])
                              , 'predoc': clean(['doc'])
                              , 'doc': 'esdoc -c ./esdoc.json && ncp CNAME doc/CNAME'
                              , 'postdoc': 'npm run git-save -- docs'
                              , 'prerelease': 'npm run build'
                              , 'release': 'npm version patch && npm publish'
                              , 'postrelease': 'npm run release-doc'
                              , 'prerelease-doc': 'npm run doc'
                              , 'release-doc': 'git subtree push --prefix doc origin gh-pages'
                              , 'postrelease-doc': 'git commit -am \"doc-release\" && git push --follow-tags'
                              , 'upgrade': 'ncu -a && npm update'
                              , 'git-save': 'git add -A && git commit -am '
                              , 'test': 'jasmine'
                              } )
