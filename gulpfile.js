const autoprefixer = require('autoprefixer');
const browserSync  = require('browser-sync');
const csslint      = require('gulp-csslint');
const del          = require('del');
const gulp         = require('gulp');
const postcss      = require('gulp-postcss');
const sass         = require('gulp-sass');
const scsslint     = require('gulp-scss-lint');


//=========================================================
//  PATHS
//---------------------------------------------------------
const paths = {
  examples: {
    css: 'examples/css',
    sass: 'examples/scss'
  },

  src: {
    sass: ['src/**/*.scss', '!src/_normalize.scss']
  },

  target: 'target'
};


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {
  autoprefixer: {
    browsers: ['last 3 versions', 'Firefox ESR']
  },

  browserSync: {
    files: [`${paths.target}/**/*`],
    notify: false,
    open: false,
    port: 3000
  },

  cssLintConfig: './.csslintrc',

  sass: {
    errLogToConsole: true,
    includePaths: ['src'],
    outputStyle: 'nested',
    precision: 10,
    sourceComments: false
  },

  scssLintConfig: './.scss-lint.yml'
};


//=========================================================
//  TASKS
//---------------------------------------------------------
gulp.task('clean.examples', () => del(paths.examples.css));


gulp.task('clean.target', () => del(paths.target));


gulp.task('lint.css', () => {
  return gulp.src(`${paths.examples.css}/**/*.css`)
    .pipe(csslint(config.cssLintConfig))
    .pipe(csslint.reporter());
});


gulp.task('lint.scss', () => {
  return gulp.src(paths.src.sass)
    .pipe(scsslint({config: config.scssLintConfig}));
});


gulp.task('sass', () => {
  return gulp.src(paths.src.sass)
    .pipe(sass(config.sass))
    .pipe(postcss([
      autoprefixer(config.autoprefixer)
    ]))
    .pipe(gulp.dest(paths.target));
});


gulp.task('sass.examples', () => {
  return gulp.src(`${paths.examples.sass}/**/*.scss`)
    .pipe(sass(config.sass))
    .pipe(postcss([
      autoprefixer(config.autoprefixer)
    ]))
    .pipe(gulp.dest(paths.examples.css));
});


gulp.task('serve', done => {
  browserSync.create()
    .init(config.browserSync, done);
});


gulp.task('default', gulp.series(
  'clean.examples',
  'clean.target',
  'sass.examples',
  function watch(){
    gulp.watch(paths.src.sass, gulp.task('sass.examples'));
  }
));
