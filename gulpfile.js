const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

// CSS (SCSS)
gulp.task("css", () => {
  return gulp
    .src("src/assets/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/assets/styles"))
    .pipe(browserSync.stream());
});

// HTML
gulp.task("html", () => {
  return gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", () => {
  return gulp
    .src("src/assets/scripts/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/assets/scripts"))
    .pipe(browserSync.stream());
});

// Images
gulp.task("images", function () {
  return gulp
    .src("src/assets/images/**/*")
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: false },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("dist/assets/images"));
});

// BrowserSync server
gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  // Watching files
  gulp
    .watch("src/assets/styles/**/*.scss", gulp.series("css"))
    .on("change", browserSync.reload);
  gulp
    .watch("src/*.html", gulp.series("html"))
    .on("change", browserSync.reload);
  gulp
    .watch("src/assets/scripts/**/*.js", gulp.series("js"))
    .on("change", browserSync.reload);
});

// Default task
gulp.task(
  "default",
  gulp.series("css", "html", "js", "images", "browser-sync")
);
