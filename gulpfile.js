const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');

const srcDir = "src/";
const targetDir = "target/";
const minifiedDir = targetDir + "minified/";

const extJS = ".js"
const extMinJS = ".min" + extJS;

const globAllJS = "*" + extJS;
const globAllMinJS = "*" + extMinJS;


function jsHint() {
  return src("./src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function clean() {
  return del([targetDir]);
}

function cssMinify(cb) {
  cb();
}

function jsBundle(cb) {
  cb();
}

function jsMinify() {
  return src(srcDir + globAllJS)
    .pipe(rename({ extname: extMinJS }))
    .pipe(dest(minifiedDir));
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
exports.js = series(jsHint, jsBundle, jsMinify)
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
