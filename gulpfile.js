const { src, dest, series, parallel } = require('gulp');

function clean(cb) {
  cb();
}

function cssMinify(cb) {
  cb();
}

function jsBundle(cb) {
  cb();
}

function jsMinify(cb) {
  cb();
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