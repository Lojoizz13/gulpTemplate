const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require('gulp-autoprefixer');
const sourceMaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

const PATHS = {
    src: "./src",
    public: "./public"
}

function styles() {
    return gulp.src("./src/css/**/*.css")
    .pipe(gulp.dest("./public"));
}

gulp.task('styles', styles);
