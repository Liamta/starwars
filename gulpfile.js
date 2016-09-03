/**
 * Gulpfile
 */

var config = require('./config/clientPaths.json');

var gulp = require('gulp');
var connect = require('gulp-connect');

var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-filesize');
var cssmin = require('gulp-cssmin');

var SERVER = true;

gulp.task('connect', function() {

    if(SERVER) {

        connect.server({
            root: "./public",
            port: 3003,
            livereload: true
        });

    }

});

gulp.task('scripts', function() {

    gulp.src(config.scripts.entry)
        .pipe(plumber())
        .pipe(browserify())
        .pipe(concat('prod.js'))
        .pipe(size())
        .pipe(gulp.dest(config.scripts.dist))
        .pipe(uglify())
        .pipe(concat('prod.min.js'))
        .pipe(size())
        .pipe(gulp.dest(config.scripts.dist))
        .pipe(connect.reload());


    if(SERVER) {
        connect.reload();
    }

});

gulp.task('styles', function() {

    gulp.src(config.styles.src)
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(size())
        .pipe(gulp.dest(config.styles.dist))
        .pipe(connect.reload());

});

gulp.task('watch', function() {

    gulp.watch(config.scripts.src, ['scripts']);
    gulp.watch(config.styles.src, ['styles']);

});

gulp.task('default', ['watch', 'connect']);
