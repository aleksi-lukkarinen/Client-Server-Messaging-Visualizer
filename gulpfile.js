const { src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const csso = require('gulp-csso');
const del = require('del');
const eslint = require('gulp-eslint');
const jsdoc = require('gulp-jsdoc3');
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
const stagingDir = targetDir + "staging/";
const esFiveStagingDir = stagingDir + "es5/";
const testDir = "./test/";

const extCSS = ".css"
const extMinCSS = ".min" + extCSS;
const extJS = ".js"
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
  return del([targetDir, stagingDir]);
}

function cssMinify(cb) {
  return src([srcDir + globAllCSS])
    .pipe(sourcemaps.init())
    .pipe(rename({ extname: extMinCSS }))
    .pipe(csso())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(esFiveDistributionDir));
}

function esLint() {
  return src([srcDir + globAllJS, srcDir + "**/" + globAllJS])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function jsDoc(cb) {
  var config = require("./" + jsDocConf);

  return src([packageJson, readmeMD, srcDir + globAllJS], {read: false})
    .pipe(jsdoc(config, cb));
}

function jsBabel() {
  return src([srcDir + globAllJS, srcDir + "**/" + globAllJS], {sourcemaps: true})
    .pipe(babel())
    .pipe(dest(esFiveBabelDir, {sourcemaps: true}));
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
    esFiveDistributionDir + globAllFiles,
    examplesDir + globAllFiles,
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

function watchSources(cb) {
  watch(srcDir + globAllJS,             series(jsBabel, jsBundle, stage, esLint, jsDoc));
  watch(srcDir + globAllCSS,            series(cssMinify, stage));
  watch(examplesDir + globAllFiles,     series(stage));
}

exports.clean = clean;
exports.eslint = esLint;
exports.jsdoc = jsDoc;
exports.js = series(esLint, jsBabel, jsBundle)
exports.css = series(cssMinify)
exports.images = images
exports.compile = parallel(exports.js, jsDoc, exports.css, images);
exports.stage = stage;
exports.unittest = unitTest;
exports.test = series(unitTest);
exports.build = series(
  exports.compile,
  exports.test,
  exports.stage,
);
exports.cleanBuild = series(exports.clean, exports.build);
exports.publish = series(exports.cleanBuild, publish);
exports.watch = series(exports.build, watchSources);
exports.default = exports.build;
