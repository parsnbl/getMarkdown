import path from "path";
import process from "process";
import webpack from "webpack";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mode = process.env.NODE_ENV || "development";

export default {
  mode: mode,
  devtool: 'source-map',
  entry: {
      background: path.join(__dirname, "src", "background-wrapper.js"),
      content: path.join(__dirname, "src", "content.js"),
  },
  output: {
    globalObject: "this",
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: "[name]",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV' : JSON.stringify(mode)
    }),
    new CopyPlugin({
        patterns: [
          
          {
                from: "src/manifest.json",
                to: path.join(__dirname, "dist"),
                force: true,
                transform: function (content, path) { // eslint-disable-line
                  // generates the manifest file using the package.json informations
                  return Buffer.from( // eslint-disable-line
                    JSON.stringify(
                      {
                        description: process.env.npm_package_description,
                        version: process.env.npm_package_version,
                        ...JSON.parse(content.toString()),
                      },
                      null,
                      "\t"
                    )
                  );
                },
              },
            /*{
              from: "src/background-wrapper.js",
              to: path.join(__dirname, "dist"),
              transform: function (content, path) {
                const updated = content.toString().replace('background.js', 'background.bundle.js')
                return updated;
              }
            },*/
            {
              from: "src/images",
              to: path.join(__dirname, "dist", "images")
            }
        ],
    })
  ]
};
