const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const markdownItConfig = require("./markdown.config");

const cssLoader = "css-loader";

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: ["autoprefixer", "cssnano", "tailwindcss"],
    },
  },
};

const srcDir = path.resolve(__dirname, "src");
const outDir = path.resolve(__dirname, "dist");

module.exports = function (env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === "production";
  return {
    target: "web",
    mode: production ? "production" : "development",
    devtool: production ? undefined : "eval-cheap-source-map",
    entry: {
      entry: "./src/main.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: production
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
    },
    optimization: {
      minimize: production ? true : false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              ecma: 2017,
              inline: 3,
            },
            module: false,
            output: {
              ecma: 2017,
            },
          },
          parallel: true,
        }),
      ],
      runtimeChunk: true,
      splitChunks: {
        chunks: "all",
        minSize: 0,
        maxInitialRequests: Infinity,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    performance: { hints: false },
    resolve: {
      extensions: [".ts", ".js", ".json"],
      modules: [
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "dev-app"),
        "node_modules",
      ],
      alias: production
        ? {
            // add your production aliasing here
          }
        : {
            ...[
              "fetch-client",
              "kernel",
              "metadata",
              "platform",
              "platform-browser",
              "plugin-conventions",
              "route-recognizer",
              "router",
              "router-lite",
              "runtime",
              "runtime-html",
              "testing",
              "webpack-loader",
            ].reduce(
              (map, pkg) => {
                const name = `@aurelia/${pkg}`;
                map[name] = path.resolve(
                  __dirname,
                  "node_modules",
                  name,
                  "dist/esm/index.dev.mjs"
                );
                return map;
              },
              {
                aurelia: path.resolve(
                  __dirname,
                  "node_modules/aurelia/dist/esm/index.dev.mjs"
                ),
                // add your development aliasing here
              }
            ),
          },
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: "asset" },
        {
          test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          type: "asset",
        },
        { test: /\.css$/i, use: ["style-loader", cssLoader, postcssLoader] },
        {
          test: /\.ts$/i,
          use: ["ts-loader", "@aurelia/webpack-loader"],
          exclude: /node_modules/,
        },
        {
          test: /[/\\]src[/\\].+\.html$/i,
          use: "@aurelia/webpack-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.md$/,
          loader: "frontmatter-markdown-loader",
          options: {
            markdownIt: markdownItConfig,
            mode: ["html"],
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "index.ejs", favicon: "favicon.ico" }),
      new Dotenv({
        path: `./.env${
          production ? "" : "." + (process.env.NODE_ENV || "development")
        }`,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "static", to: path.resolve(__dirname, "dist") }],
      }),
      production &&
        new CompressionPlugin({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(js|ts|css|html|svg|md|json)$/,
          compressionOptions: {
            level: 11,
          },
          threshold: 0,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
      analyze && new BundleAnalyzerPlugin(),
    ].filter((p) => p),
  };
};
