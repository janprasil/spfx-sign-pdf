/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
"use strict";

const build = require("@microsoft/sp-build-web");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistPath, "cmaps");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  result.set("serve", result.get("serve-deprecated"));
  return result;
};

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    let pluginDefine = null;
    for (var i = 0; i < generatedConfiguration.plugins.length; i++) {
      var plugin = generatedConfiguration.plugins[i];
      if (plugin instanceof webpack.DefinePlugin) {
        pluginDefine = plugin;
      }
    }

    const currentEnv = {
      SIGN_API_URL: process.env.SIGN_API_URL,
      AAD_CLIENT_KEY: process.env.AAD_CLIENT_KEY,
    };

    if (pluginDefine) {
      pluginDefine.definitions = {
        ...pluginDefine.definitions,
        "process.env": JSON.stringify(
          Object.assign(
            pluginDefine.definitions["process.env"] || {},
            currentEnv
          )
        ),
      };
    } else {
      generatedConfiguration.plugins.push(
        new webpack.DefinePlugin({ "process.env": { ...currentEnv } })
      );
    }

    generatedConfiguration.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: cMapsDir,
            to: "cmaps/",
          },
        ],
      })
      // new webpack.DefinePlugin({
      //   "process.env": JSON.stringify(process.env),
      //   // "process.env.SIGN_API_URL": JSON.stringify(process.env.SIGN_API_URL),
      //   // "process.env.AAD_CLIENT_KEY": JSON.stringify(
      //   //   process.env.AAD_CLIENT_KEY
      //   // ),
      // })
    );

    // Remove react and react-dom from externals to allow embedding react 18 inside the bundle
    if (Array.isArray(generatedConfiguration.externals)) {
      console.log("🐱‍👤 Removed react and react-dom from externals");

      // remove "react" and "react-dom" from externals
      generatedConfiguration.externals =
        generatedConfiguration.externals.filter(
          (external) => external !== "react" && external !== "react-dom"
        );
    }

    return generatedConfiguration;
  },
});

build.initialize(require("gulp"));
