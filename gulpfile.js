"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var del = require("del");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");



const clean = () => del("build");

const compileStyles = () =>
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));

const createSVGSprite = () =>
	gulp
    .src("source/img/*.svg")
		.pipe(plumber())
		.pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
		.pipe(gulp.dest("build/img"));

const copyImages = () =>
  gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));

const createWebp = () =>
  gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));

const modifyHTML = () =>
  gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));

const copyAssets = () =>
	gulp
  .src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source", since:gulp.lastRun(copyAssets)
  })
  .pipe(gulp.dest("build"));

const watch = (done) => {
	gulp.watch("source/less/**/*.less", compileStyles);
	gulp.watch("source/img/*.svg", createSVGSprite);
	gulp.watch([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], copyAssets);
  gulp.watch("source/*.html", modifyHTML);
	done();
};

const syncBrowser = (done) => {
	server.init(null, {
		server: {
			baseDir: './build'
		}
	});
	server.watch('build/**/*.*').on('change', server.reload);
	done();
};

const buildQueue = [
	clean,
	createSVGSprite,
  copyImages,
  createWebp,
	compileStyles,
  copyAssets,
  modifyHTML
];

gulp.task('build', gulp.series(...buildQueue));
gulp.task('dev', gulp.series('build', gulp.parallel(watch, syncBrowser)));



// gulp.task("serve", ["style"], function() {
//   server.init({
//     server: "source/",
//     notify: false,
//     open: true,
//     cors: true,
//     ui: false
//   });

//   gulp.watch("source/less/**/*.less", ["style"]);
//   gulp.watch("source/*.html").on("change", server.reload);
// });
