var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');

var paths = {
    sass: ['./scss/**/*.scss'],
    js: [
        './www/js/config/*.js',
        './www/js/controllers/**/**/*.js',
        './www/js/controllers/**/*.js',
        './www/js/controllers/*.js',
        './www/js/directives/*.js',
        './www/js/services/**/**/*.js',
        './www/js/services/**/*.js'
    ],
    html: [
        './www/views/**/*.html'
    ],
    css:[
        './www/css/**/**/*.css',
        './www/css/**/*.css'
    ]
};

gulp.task('default', [
    'combine-js',
    'sass',
    'make-templatecache',
    'minify-css'
]);

gulp.task('combine-js', function () {
    return gulp.src(paths.js)

        .pipe(concat('app.all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./www/final'));
});

gulp.task('make-templatecache', function () {
    return gulp.src(paths.html)
        .pipe(templateCache('templates.js', {
            module:'cookers', root : './www/views'}))
        .pipe(gulp.dest('./www/final'));
});

gulp.task('minify-css', function() {
    return gulp.src(paths.css)
        .pipe(minifyCss())
        .pipe(gulp.dest('./www/final'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
