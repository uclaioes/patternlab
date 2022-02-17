'use strict'
// generated on 2015-03-16 using generator-gulp-webapp 0.3.0
var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var browserSync = require('browser-sync')
var reload = browserSync.reload

gulp.task('jshint', function () {
  return gulp
    .src(['wp-content/themes/ioes/**/*.js'])
    .pipe(
      reload({
        stream: true,
        once: true
      })
    )
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
})

gulp.task('styles', function () {
  return gulp
    .src(['scss/ioes/style.scss'])
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'expanded', // libsass doesn't support expanded yet
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error:')
      })
    )
    .pipe(
      $.postcss([
        require('autoprefixer')({
          browsers: ['ie >= 9', 'last 2 versions', 'iOS 7']
        })
      ])
    )
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('wp-content/themes/ioes'))
    .pipe(gulp.dest('patternlab/source/css'))
    .pipe(
      reload({
        stream: true
      })
    )
})


gulp.task(
  'serve',
  gulp.series([
    'jshint',
    'styles',
    function () {
      browserSync({
        notify: false,
        proxy: 'localhost:8888',
        ghostMode: {
          clicks: false,
          forms: false,
          scroll: false
        }
      })

      // watch for changes
      gulp
        .watch([
          'wp-content/themes/ioes/*.php',
          'wp-content/themes/ioes/js/**/*.*',
          'wp-content/themes/ioes/images/**/*',
          '.tmp/fonts/**/*',
          'wp-content/themes/ioes/icons/**/*'
        ])
        .on('change', reload)

      gulp.watch('scss/**/*.scss', gulp.series(['styles']))
    }
  ])
)

// register patternlab
var loadPatternlab = require('./patternlab-gulpfile')

var source = './patternlab/rendered'

var destination = './patternlab/for_deploy_review'

gulp.task('reviewWatch', function (done) {
  return gulp
    .src(source + '/**/*', {
      base: source
    })
    .pipe(
      $.watch(source, {
        base: source
      })
    )
    .pipe(gulp.dest(destination))
})

gulp.task('reviewCopy', function () {
  return gulp
    .src('patternlab/rendered/**/*')
    .pipe(gulp.dest('patternlab/for_deploy_review'))
})

gulp.task('styleWatch', function (done) {
  return gulp.watch('scss/**/*.scss', gulp.series(['styles']))
})

gulp.task(
  'patternlab',
  gulp.parallel([
    'styles',
    'patternlab:serve',
    'reviewCopy',
    'reviewWatch',
    'styleWatch'
  ])
)

gulp.task('default', gulp.series(['serve']))
