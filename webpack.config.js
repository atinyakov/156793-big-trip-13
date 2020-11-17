const path = require("path");

module.exports = ({ mode }) => ({
  mode,
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    compress: true,
    port: 3000,
    hot: true,
  },
  devtool: "source-map",
});
