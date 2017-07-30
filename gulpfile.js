var gulp = require('gulp');
var path = require('path');
var del = require('del');
var ts = require('gulp-typescript');
var lazypipe = require('lazypipe');
var pug = require('pug'); 
var inlineTemplates = require('gulp-inline-ng2-template');
var cache = require('gulp-cached');
var exec = require('child_process').exec;
var isWin = /^win/.test(process.platform);
var executable = isWin ? 'node_modules\\.bin\\ngc.cmd' : './node_modules/.bin/ngc';
var webpack = require('webpack');
var argv = require('yargs')
            .boolean('failOnError').default('failOnError', false) // tslint
            .argv;

var PATHS = {
  src: ['src/**/*.ts','!src/**/*.spec.ts'],
  templates: 'src/**/*.pug', 
  spec: 'src/**/*.ts',
  temp: 'temp/',
  tsInline: 'temp/inline/',
  dist: 'node_modules/ngx-card',
};

var inlineTemplatesTask = lazypipe()
  .pipe(inlineTemplates, {
    base: '/src',
    useRelativePaths: true,
    templateProcessor: function(filepath, ext, file, cb) {
      const rendered = pug.render(file, {
        doctype: 'html',
        filename: filepath,
      });
      cb(null, rendered);
    },
    templateExtension: '.pug',
  });

gulp.task('clean', function() {
  return del([PATHS.dist, PATHS.temp]);
});

gulp.task('lint:ts', function lint_ts_impl() {
  var tslint = require('gulp-tslint');

  return gulp.src( PATHS.spec )
    .pipe(cache('lint:ts'))
    .pipe(tslint({
      formatter: 'prose',
    }))
    .pipe(tslint.report({
      emitError: argv.failOnError,
      summarizeFailureOutput: true,
    }));
});

gulp.task('ngc:templates', function() {
  return gulp.src(PATHS.src, {base: 'src'})
    .pipe(gulp.dest(PATHS.tsInline));
});

gulp.task('ngc', gulp.series('lint:ts', 'ngc:templates', function __ngc(cb) {
  exec(`${executable} -p ./tsconfig.json`, (e) => {
    if (e) console.log(e);
    del('./temp/waste');
    cb();
  }).stdout.on('data', function(data) { console.log(data); });
}));

gulp.task('bundle', function __bundle(done) {
  webpack({
    devtool: 'source-map',
    resolve: { extensions: ['.js'] },
    entry: path.resolve(__dirname, PATHS.dist, 'ngx-card.js'),
    output: {
      filename: PATHS.dist + '/bundles/ngx-card.umd.js',
      library: 'ngx-card',
      libraryTarget: 'umd'
    },
    externals: [/^\@angular\//, /^rxjs\//], // require but don't bundle
  }, function(err, stats) {
    if (err) throw new Error('bundle [webpack]', err);
    done();
  });
});

gulp.task('build', gulp.series('clean', 'ngc', 'bundle'));

gulp.task('build:watch', function() {
  gulp.watch([ PATHS.src ], gulp.series('ngc', 'bundle'));
});

gulp.task('demo:clean', function() {
  return del(['demo/**/*.ngfactory.ts', 'demo/**/*.ngsummary.json', 'demo/node_modules', 'temp/demo']);
});

gulp.task('demo:ngc', gulp.series('demo:clean', function __ngc(cb) {
  exec(`${executable} -p ./demo/tsconfig-aot.json`, (e) => {
    if (e) console.log(e);
    cb();
  }).stdout.on('data', function(data) { console.log(data); });
}));

gulp.task('prepublish', gulp.series('build', function prepublish_impl() {
  return gulp.src(['package.json', '*.md', 'LICENSE'])
    .pipe(gulp.dest(PATHS.dist));
}));

gulp.task('default', gulp.series('build'));
