const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProduction = false;

module.exports = [
  {
    entry: "./scripts/script.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist",
    },
  },
  {
    mode: "development",
    entry: "./scripts/reactscript.js",
    output: {
      filename: "main2.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist",
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? "production" : "development",
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  },
];
