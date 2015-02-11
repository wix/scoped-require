var Module = require('module');
var _ = require('lodash');
var path = require('path');

module.exports = function generateRequireForUserCode(scopedDirs) {
  var forExtensions = Object.keys(require.extensions);
  scopedDirs = _.map(scopedDirs, function(dir) {return path.resolve(dir)});

  var baseModule = require('./lib/stubmodule-that-does-the-require');
  // so that it can be re-used again with another scoped-dir, I delete it from the cache
  delete Module._cache[baseModule.id];

  function inUserCodeDirs(modulePath) {
    return _.some(scopedDirs, function(userCodeDir) {return modulePath.indexOf(userCodeDir) >= 0});
  }

  function removePathsNotInUserCodeDirs(m) {
    m.paths = _.filter(m.paths.concat(scopedDirs), function(modulePath) { return inUserCodeDirs(modulePath); });
  }

  removePathsNotInUserCodeDirs(baseModule);

  _.forEach(forExtensions, function(ext) {
      var original = require.extensions[ext];
      if (original && original.__dontExtendThisScopedRequire)
        return;

      require.extensions[ext] = function requireThatAddsUserCodeDirs(m, filename) {
        if (inUserCodeDirs(m.filename))
          removePathsNotInUserCodeDirs(m);

        return original(m, filename);
      };
      Object.defineProperty(require.extensions[ext], "__dontExtendThisScopedRequire", {value: true});
    });

  return {
    require: baseModule.require.bind(baseModule),
    module: baseModule,
    clearCache: function () {
      function deleteModuleFromCache(m) {
        delete Module._cache[m.id];
        _.forEach(m.children, function (subModule) {
          deleteModuleFromCache(subModule);
        });
      }
      deleteModuleFromCache(baseModule);
    }
  }
};
