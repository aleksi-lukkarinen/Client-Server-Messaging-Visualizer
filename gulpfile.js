const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const jshint = require('gulp-jshint');
const log = require('gulplog');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');

const srcDir = "src/";
const targetDir = "target/";
const esFiveDir = targetDir + "es5/";
const esFiveBabelDir = esFiveDir + "babel/";
const esFiveDistributionDir = esFiveDir + "dist/";

const extJS = ".js"
const extMinJS = ".min" + extJS;

const globAllJS = "*" + extJS;
const globAllMinJS = "*" + extMinJS;
const primaryJSFile = "main" + extJS;
const esFiveDistroJSFile = "cs-mes-vis" + extMinJS;


function clean() {
  return del([targetDir]);
}

function cssMinify(cb) {
  cb();
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

function unitTest(cb) {
  cb();
}

function publish(cb) {
  cb();
}


exports.clean = clean;
exports.css = series(cssMinify)
exports.images = images
exports.js = series(jsHint, jsBabel, jsBundle)
exports.jshint = jsHint;
exports.unittest = unitTest;
exports.test = series(unitTest);
exports.publish = publish;
exports.build = series(
  clean,
  parallel(
    exports.js,
    exports.css,
    images
  ),
  exports.test,
  exports.publish
);
exports.default = exports.build;
