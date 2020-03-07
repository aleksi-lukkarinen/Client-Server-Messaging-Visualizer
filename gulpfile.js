const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const csso = require('gulp-csso');
const del = require('del');
const jshint = require('gulp-jshint');
const log = require('gulplog');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');

const srcDir = "./src/";
const examplesDir = "./examples/";
const targetDir = "./target/";
const buildDir = targetDir + "build/";
const esFiveBuildDir = buildDir + "es5/";
const esFiveBabelDir = esFiveBuildDir + "babel/";
const esFiveDistributionDir = esFiveBuildDir + "dist/";
const stagingDir = targetDir + "./staging/";
const esFiveStagingDir = stagingDir + "es5/";

const extCSS = ".css"
const extMinCSS = ".min" + extCSS;
const extJS = ".js"
const extMinJS = ".min" + extJS;

const globAllCSS = "*" + extCSS;
const globAllMinCSS = "*" + extMinCSS;
const globAllJS = "*" + extJS;
const globAllMinJS = "*" + extMinJS;
const primaryJSFile = "main" + extJS;
const esFiveDistroJSFile = "cs-mes-vis" + extMinJS;


function clean() {
  return del([targetDir, stagingDir]);
}

function cssMinify(cb) {
  return src([srcDir + globAllCSS])
    .pipe(csso())
    .pipe(rename({ extname: extMinCSS }))
    .pipe(dest(esFiveDistributionDir));
}

function jsHint() {
  return src([srcDir + globAllJS, srcDir + "**/" + globAllJS])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function jsBabel() {
  return src([srcDir + globAllJS, srcDir + "**/" + globAllJS])
    .pipe(babel())
    .pipe(dest(esFiveBabelDir));
}

function jsBundle() {
  const bundleStream = browserify({
    entries: [esFiveBabelDir + primaryJSFile],
    debug: true
  }).bundle();

  return bundleStream
    .pipe(source(esFiveDistroJSFile))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(streamify(uglify()))
      .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(dest(esFiveDistributionDir));
}

function images(cb) {
  cb();
}

function stage(cb) {
  const sourceFiles = [
    esFiveDistributionDir + "*.*",
    examplesDir + "*.*",
  ];

  return src(sourceFiles)
    .pipe(dest(esFiveStagingDir));
}

function unitTest(cb) {
  cb();
}

function publish(cb) {
  cb();
}


exports.clean = clean;
exports.jshint = jsHint;
exports.js = series(jsHint, jsBabel, jsBundle)
exports.css = series(cssMinify)
exports.images = images
exports.compile = parallel(exports.js, exports.css, images);
exports.stage = stage;
exports.unittest = unitTest;
exports.test = series(unitTest);
exports.publish = publish;
exports.build = series(
  exports.compile,
  exports.test,
  exports.stage,
  exports.publish
);
exports.cleanBuild = series(exports.clean, exports.build);
exports.default = exports.build;
