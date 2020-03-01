const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

const srcDir = "src/";
const targetDir = "target/";
const minifiedDir = targetDir + "minified/";

const extJS = ".js"
const extMinJS = ".min" + extJS;

const globAllJS = "*" + extJS;
const globAllMinJS = "*" + extMinJS;


function clean(cb) {
  cb();
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
exports.js = series(jsBundle, jsMinify)
exports.unitTest = unitTest;
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
