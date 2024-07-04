const { override, addWebpackAlias } = require('customize-cra')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = override((config) => {
    if (!config.resolve.plugins) {
        config.resolve.plugins = []
    }
    config.resolve.plugins.push(new TsconfigPathsPlugin())
    return config
})
