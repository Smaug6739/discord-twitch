// IMPORT
// ----------------------------------------------------------------------------
const { src, dest, series } = require("gulp");
const gulp = require("gulp");
const gulpTS = require("gulp-typescript");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpNodemon = require("gulp-nodemon");
const del = require("del");
const path = require("path");

// PREPARE PROJECT
// ----------------------------------------------------------------------------
const project = gulpTS.createProject("tsconfig.json");

function build() {
    del.sync(["./build/**/*.*"]);
    src("./src/**/*.yml").pipe(dest("build/"));
    src("./src/**/*.js").pipe(dest("build/"));
    const tsCompile = src("./src/**/*.ts")
        .pipe(gulpSourcemaps.init())
        .pipe(project());
    return tsCompile.js
        .pipe(
            gulpSourcemaps.write({
                sourceRoot: file =>
                    path.relative(path.join(file.cwd, file.path), file.base)
            })
        )
        .pipe(dest("build/"));
}

function watch() {
    gulp.watch(["./src/**/*.ts"], build);
    gulp.watch(["./src/**/*.js"], build);
    gulp.watch(["./src/**/*.yml"], build);
}

function start() {
    return gulpNodemon({
        script: "./build/main.js",
        watch: "./build/main.js"
    })
}

function serve() {
    return gulpNodemon({
        script: "./build/main.js",
        watch: "./build/"
    });
}
exports.build = build;
exports.serve = series(watch, serve);
exports.start = series(build, start);
exports.watch = series(build, watch);
