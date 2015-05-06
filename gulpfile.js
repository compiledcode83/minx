var browserSync = require('browser-sync'),
    bump = require('gulp-bump'),
    del = require('del'),
    gulp = require('gulp'),
    sass = require('gulp-sass');
    //sourcemaps = require('gulp-sourcemaps');

var manifests = ['./bower.json', './package.json'];


gulp.task('bump', function(){
  return gulp.src(manifests)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean', function clean(done){
  del('./target/*', done);
});


gulp.task('copy:html', function copyHTML(){
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./target'));
});


gulp.task('sass', function compileSass(){
  return gulp.src('./src/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./target'));
});


gulp.task('serve', function server(){
  var bs = browserSync.create();

  bs.init({
    server: {
      baseDir: '.'
    },
    files: ['target/**/*'],
    browser: "firefox",
    port: 7000
  });
});


gulp.task('default', gulp.series('clean', 'sass', 'copy:html', function watch(){
  gulp.watch('./src/**/*.scss', gulp.task('sass'));
  gulp.watch('./src/**/*.html', gulp.task('copy:html'));
}));
