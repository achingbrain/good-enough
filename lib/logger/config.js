
module.exports = function (config) {
  config = config || {}

  for (var key in config) {
    module.exports[key] = config[key]
  }
}
