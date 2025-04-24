module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            net: false,
            tls: false,
            fs: false,
          },
        },
      },
    },
  };