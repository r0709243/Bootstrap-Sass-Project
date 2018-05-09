var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
    browserSync.init({
        startPath: '/index.html',
        server: {
            baseDir: "./public_html/",
            directory: true
        }
    });
});

// Optimize CSS just before publishing
gulp.task('cssnano', function () {
    return gulp.src('./public_html/**/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./public_html'));
});


// Copy bootstrap JS-files
gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('./public_html/js'));
});

// Compile sass into CSS (/public_html/css/) & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        // outputStyle: nested (default), expanded, compact, compressed
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefix("last 2 versions"))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public_html/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch('**/*.scss', {cwd: './scss/'}, ['sass']);
    gulp.watch('**/*.{html,js,php}', {cwd: './public_html/'}, browserSync.reload);
});

gulp.task('default', ['sass', 'watch', 'browser-sync']);
gulp.task('build', ['cssnano']);