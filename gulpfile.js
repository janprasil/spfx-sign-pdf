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
      APP_SERVER_BASE_URL: process.env.APP_SERVER_BASE_URL,
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

const postcss = require("gulp-postcss");
const tailwind = require("tailwindcss");

const tailwindcss = build.subTask(
  "tailwindcss",
  function (gulp, buildOptions, done) {
    gulp
      .src("assets/tailwind.css")
      .pipe(postcss([tailwind("./tailwind.config.js")]))
      .pipe(gulp.dest("assets/dist"));
    done();
  }
);
build.rig.addPreBuildTask(tailwindcss);
/* end of tailwind */

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

build.initialize(require("gulp"));
