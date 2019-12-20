const gulp = require("gulp");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');

const PATHS = {
    src: "./src",
    public: "./public"
};

const sassOrder = [
    "src/sass/**/*.sass",
]

function stylesSass() {
    return gulp.src(sassOrder)
    .pipe(sourcemaps.init())
    .pipe(concat("styles.sass"))
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(cleanCSS({compatibility: 'ie8', level: 2}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.public))
    .pipe(browserSync.stream());
}

function js() {
    return gulp.src(`${PATHS.src}/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(babel())
    .pipe(uglify({ toplevel: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.public}`))
    .pipe(browserSync.stream());
}

function html() {
    return gulp.src(`${PATHS.src}/index.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`${PATHS.public}`))
}

function imageMin() {
    return gulp.src(`${PATHS.src}/imgs/*`)
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(`${PATHS.public}/imgs`))
}

function imageMove() {
    return gulp.src(`${PATHS.src}/imgs/*`)
    .pipe(gulp.dest(`${PATHS.public}/imgs`))
}

function reload(done) {
    browserSync.reload();
    done();
}

function watch() {

    browserSync.init({
        server: {
            baseDir: PATHS.public
        }
    });

    gulp.watch(`${PATHS.src}/sass/**/*.sass`, stylesSass);
    gulp.watch(`${PATHS.src}/js/**/*.js`, js);
    gulp.watch(`${PATHS.src}/**/*.html`, gulp.series(html, reload));
    gulp.watch(`${PATHS.src}/imgs/*`, imageMove);
}

async function clean() {
    await del([PATHS.public]);
}

gulp.task("dev", gulp.series(clean, gulp.parallel(js, stylesSass, html, imageMove), watch));
gulp.task("prod", gulp.series(clean, gulp.parallel(js, stylesSass, html, imageMin)));
