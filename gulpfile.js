/* eslint-disable capitalized-comments, dot-location, func-style, global-require */
/* eslint-disable multiline-comment-style, no-multi-spaces, prefer-template */

/* global require, exports */




const {src, dest, series, parallel, watch} = require("gulp");
const babel = require("gulp-babel");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const csso = require("gulp-csso");
const del = require("del");
const eslint = require("gulp-eslint");
// const jest = require("gulp-jest").default;
const jsdoc = require("gulp-jsdoc3");
const log = require("gulplog");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const streamify = require("gulp-streamify");
const uglify = require("gulp-uglify");

const srcDir = "./src/";
const srcExamplesDir = srcDir + "examples/";
const srcMainDir = srcDir + "main/";
const srcMainJsDir = srcMainDir + "javascript/";
const srcMainCSSDir = srcMainDir + "css/";
const srcTestDir = srcDir + "test/";
const srcTestJsDir = srcTestDir + "javascript/";
const targetDir = "./target/";
const buildDir = targetDir + "build/";
const esFiveBuildDir = buildDir + "es5/";
const esFiveBabelDir = esFiveBuildDir + "babel/";
const esFiveDistributionDir = esFiveBuildDir + "dist/";
const stagingDir = targetDir + "staging/";
const esFiveStagingDir = stagingDir + "es5/";

const extCSS = ".css";
const extMinCSS = ".min" + extCSS;
const extJS = ".js";
const extMinJS = ".min" + extJS;
const extJSON = ".json";
const extMD = ".md";

const globAllFiles = "*.*";
const globAllCSS = "*" + extCSS;
const globAllMinCSS = "*" + extMinCSS;
const globAllJS = "*" + extJS;
const globAllMinJS = "*" + extMinJS;
const primaryJSFile = "Main" + extJS;
const esFiveDistroJSFile = "cs-mes-vis" + extMinJS;

const readmeMD = "README" + extMD;
const jsDocConf = "jsdoc" + extJSON;
const packageJson = "package" + extJSON;


function clean() {
  return del([targetDir]);
}

function cssMinify() {
  return src([srcMainCSSDir + globAllCSS])
    .pipe(sourcemaps.init())
    .pipe(rename({extname: extMinCSS}))
    .pipe(csso())
    .pipe(sourcemaps.write("."))
    .pipe(dest(esFiveDistributionDir));
}

function esLint() {
  return src([srcMainJsDir + globAllJS, srcMainJsDir + "**/" + globAllJS])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function jsDoc(cb) {
  const config = require("./" + jsDocConf);

  return src([packageJson, readmeMD, srcMainJsDir + globAllJS], {read: false})
    .pipe(jsdoc(config, cb));
}

function jsBabel() {
  return src([srcMainJsDir + globAllJS, srcMainJsDir + "**/" + globAllJS], {sourcemaps: true})
    .pipe(babel())
    .pipe(dest(esFiveBabelDir, {sourcemaps: true}));
}

function jsBundle() {
  const bundleStream = browserify({
    entries: [esFiveBabelDir + primaryJSFile],
    debug: true,
  }).bundle();

  return bundleStream
    .pipe(source(esFiveDistroJSFile))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(streamify(uglify()))
      .on("error", log.error)
    .pipe(sourcemaps.write("./"))
    .pipe(dest(esFiveDistributionDir));
}

function images(cb) {
  cb();
}

function stage() {
  const sourceFiles = [
    esFiveDistributionDir + globAllFiles,
    srcExamplesDir + globAllFiles,
  ];

  return src(sourceFiles)
    .pipe(dest(esFiveStagingDir));
}

function unitTest(cb) {
/*
 * 14.3.2020 AL: It should be possible to run Jest via Gulp using the gulp-jest plugin,
 * but a new version of the plugin needs to be released before that, as there is
 * a compatibility problem with a new Jest version (the fix is in GitHub already).
 */

/*
  process.env.NODE_ENV = "test";

  return src(srcTestJsDir + globAllJS)
    .pipe(jest({}));
*/

  cb();
}

function publish(cb) {
  cb();
}

function watchSources() {
  watch(srcMainJsDir + globAllJS,           series(jsBabel, jsBundle, stage, esLint, jsDoc));
  watch(srcMainCSSDir + globAllCSS,         series(cssMinify, stage));
  watch(srcExamplesDir + globAllFiles,      series(stage));
}

exports.clean = clean;
exports.eslint = esLint;
exports.jsdoc = jsDoc;
exports.js = series(esLint, jsBabel, jsBundle);
exports.css = series(cssMinify);
exports.images = images;
exports.compile = parallel(exports.js, jsDoc, exports.css, images);
exports.stage = stage;
exports.unittest = unitTest;
exports.test = series(unitTest);
exports.build = series(exports.compile, exports.test, exports.stage);
exports.cleanBuild = series(exports.clean, exports.build);
exports.publish = series(exports.cleanBuild, publish);
exports.watch = series(exports.build, watchSources);
exports.default = exports.build;
