#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

## What is scoped-require?

scoped-require enables you to designate a directory as a "firewalled" directory - requires from this base directory
will be firewalled into that directory and will not be allowed to escape.
This means that require-ing a module external to that directory will fail.

Why would anyone use it? For user-code, that you want to run under your node program, but don't want them
to use your modules and your code.

The module also enables you to re-import everything under that folder, to enable a use-case where the user
changes something in the module and wants to reload it, without restarting your application.

## Install

```sh
$ npm install --save scoped-require
```


## Usage

```js
var scopedRequire = require('scoped-require');

var baseModule = scopedRequire(['dir-with-module']);

var aModule = baseModule.require('a-module');

// use module...

baseModule.clearCache();

// reload module
aModule = baseModule.require('a-module');

```

## Reference API
```js
var scopedRequire = require('scoped-require');
```

The module exposes a factory returning a base module -

### `scopedRequire(scopedDirs, /*optional*/forExtensions)`:
The parameters are:
* `scopedDirs`: an array of directories (full or relative paths. If relative, they are relative to cwd).
These directories are the search path - any scoped require will search these directories, in the order they were given.

Returns an object with the following method:
* `require`: use this require to require any module which is in one of the `scopedDirs`
* `loadCodeAsModule(content, filename)`: use this as an alternative to require, to load code that is dynamic.
the `filename` is to make the errrors make sense.
* `clearCache`: a method, that if called, will clear the module cache of all the modules
already loaded from the `scopedDirs`. require-ing them again will reload them.

## License

MIT © [Wix]()


[npm-url]: https://npmjs.org/package/scoped-require
[npm-image]: https://badge.fury.io/js/scoped-require.svg
[travis-url]: https://travis-ci.org/wix/scoped-require
[travis-image]: https://travis-ci.org/wix/scoped-require.svg?branch=master
[daviddm-url]: https://david-dm.org/wix/scoped-require.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/wix/scoped-require
