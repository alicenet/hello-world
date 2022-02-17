// eslint-disable-next-line
module.exports = function (context, options) {
    return {
      name: 'custom-docusaurus-plugin',
      // eslint-disable-next-line
      configureWebpack(config, isServer, utils) {
        return {
          resolve: {
            alias: {
              path: require.resolve('path-browserify'),
            },
            fallback: {
              assert: require.resolve("assert"),
              crypto: require.resolve("crypto-browserify"),
              fs: false,
              http: require.resolve("stream-http"),
              https: require.resolve("https-browserify"),
              os: require.resolve("os-browserify"),
              stream: require.resolve("stream-browserify"),
              url: require.resolve("url")
            },
          },
        };
      },
    };
  };