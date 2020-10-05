const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

const markdownIt = require("markdown-it");
const attrs = require("markdown-it-attrs");
const bracketedSpans = require("markdown-it-bracketed-spans");
const customBlock = require("markdown-it-custom-block");
const divs = require("markdown-it-div");
const hljs = require("highlight.js");

const cssLoader = "css-loader";

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    plugins: () => [
      require("tailwindcss"),
      require("autoprefixer")(),
      require("cssnano")({
        preset: "default",
      }),
    ],
  },
};

const srcDir = path.resolve(__dirname, "src");
const outDir = path.resolve(__dirname, "dist");

const labelErrorMessage = `<span class="label">Labels are not formatted correctly. Should be formatted as ["one", "two"]</span>`;
const labelLink = (label) => `<a><span class='label mr-3 mb-4'>${label}</span></a>`;

const customBlocks = {
  labels(labels) {
    let parsed;
    try {
      parsed = JSON.parse(labels);
    } catch (_) {
      return labelErrorMessage;
    }

    return `<div class="mb-4">${parsed
      .map((label) => {
        return labelLink(label);
      })
      .join("")}</div>`;
  },
};

function highlighter(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + "</code></pre>";
    } catch (__) {}
  }

  return '<pre class="hljs"><code>' + markdownIt().utils.escapeHtml(str) + "</code></pre>";
}

const markdownItConfig = markdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    return highlighter(str, lang);
  },
})
  .use(attrs)
  .use(bracketedSpans)
  .use(customBlock, customBlocks)
  .use(divs);

module.exports = function (env, { analyze, extractCss }) {
  const production = env === "production" || process.env.NODE_ENV === "production";
  return {
    mode: production ? "production" : "development",
    devtool: production ? "source-map" : "eval",
    entry: "./src/main.ts",
    cache: production ? false : { type: "memory" },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: production ? "[name].[chunkhash].bundle.js" : "[name].[hash].bundle.js",
      sourceMapFilename: production ? "[name].[chunkhash].bundle.map" : "[name].[hash].bundle.map",
      chunkFilename: production ? "[name].[chunkhash].chunk.js" : "[name].[hash].chunk.js",
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
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
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
      extensions: [".ts", ".js", "json"],
      modules: [srcDir, "node_modules"],
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
      lazy: false,
    },
    module: {
      rules: [
        { test: /\.(png|gif|jpg|cur)$/i, loader: "url-loader", options: { limit: 8192 } },
        {
          test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff2" },
        },
        { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: "url-loader", options: { limit: 10000, mimetype: "application/font-woff" } },
        { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: "file-loader" },
        { test: /\.css$/i, use: ["style-loader", cssLoader, postcssLoader] },
        { test: /\.ts$/i, use: ["ts-loader", "@aurelia/webpack-loader"], exclude: /node_modules/ },
        { test: /\.html$/i, use: "@aurelia/webpack-loader", exclude: /node_modules/ },
        {
          test: /\.md$/,
          loader: "frontmatter-markdown-loader",
          options: {
            markdownIt: markdownItConfig,
            mode: ["body", "html"],
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "index.ejs" }),
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
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
      analyze && new BundleAnalyzerPlugin(),
    ].filter((p) => p),
  };
};
