# [transform-package](https://npmjs.com/packages/transform-package)

Transforms a set of package.json transforms to create a new package.json. Targets a specific platform for output so scripts are cross compatible with Windows and OSX.

Save as a dev dependency.

`npm i -D transform-package`


### CLI


`transform-package /path/to/package.scripts.json [path/to/package.json]`


* If package.json path left blank, current working directory is assumed.
* Can be installed globally but it is recommended to save as a dev dependency and run from a package.json script.
* Only creates new or overwrites nodes, never deletes nodes.

___

From scripts section of your package.json:


```json

{
  "scripts": {
    "build-package": "transform-package src/package/package.scripts.json",
    "prebuild": "npm run build-package",
    "build": "..."
  }
}


___


### API


Support coming soon...
