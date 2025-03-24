module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
            exclude: /@twa-dev\/sdk/,
          },
        ],
      },
    },
  },
};
