# [repackage](https://npmjs.com/packages/repackage)

Transforms a set of package.json transforms to create a new package.json. Targets a specific platform for output so scripts are cross compatible with Windows and OSX.

Save as a dev dependency.

`npm i -D repackage`


### CLI


`repackage /path/to/package.scripts.json [path/to/package.json]`


* If package.json path left blank, current working directory is assumed.
* Can be installed globally but it is recommended to save as a dev dependency and run from a package.json script.
* Only creates new or overwrites nodes, never deletes nodes.

___

From scripts section of your package.json:


```json

{
  "scripts": {
    "build-package": "repackage src/package/package.scripts.json",
    "prebuild": "npm run build-package",
    "build": "..."
  }
}

```

___


### API


```js

import createRepackage from 'repackage'
const repackage = createRepackage({ log: console })
repackage('path/to/transform/dir', 'path/to/package.json')
  .then(message => console.info(message))
  .catch(err => console.error(err))

```
