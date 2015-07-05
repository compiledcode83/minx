var autoprefixer = require('autoprefixer-core'),
    browserSync  = require('browser-sync'),
    bump         = require('gulp-bump'),
    csslint      = require('gulp-csslint'),
    del          = require('del'),
    gulp         = require('gulp'),
    mocha        = require('gulp-mocha'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    scsslint     = require('gulp-scss-lint'),
    gutil        = require('gulp-util');

var manifests = ['./bower.json', './package.json'];


gulp.task('bump:patch', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean:examples', function(done){
  del('./examples/css/*', done);
});


gulp.task('lint:css', function() {
  return gulp.src('./target/**/*.css')
    .pipe(csslint('./.csslintrc'))
    .pipe(csslint.reporter());
});


gulp.task('lint:scss', function() {
  return gulp.src(['./src/**/*.scss', '!./src/_normalize.scss'])
    .pipe(scsslint({config: './.scss-lint.yml'}));
});


gulp.task('test', function(){
  return gulp.src('./test/test.js')
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', gutil.log);
});


gulp.task('examples', function examples(){
  return gulp.src('./examples/scss/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR', 'Opera 12.1'] }) ]))
    .pipe(gulp.dest('./examples/css'));
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['examples/**/*'],
      notify: false,
      port: 7000,
      server: {
        baseDir: '.'
      }
    });
});


gulp.task('default', gulp.series('clean:examples', 'examples', function watch(){
  gulp.watch(['./src/**/*.scss', './examples/**/*.scss'], gulp.task('examples'));
}));


gulp.task('tdd', gulp.series('test', function watch(){
  gulp.watch(['./src/**/*.scss', './test/**/*.scss'], gulp.task('test'));
}));
