var gulp = require('gulp'),
    inject = require('gulp-inject'),
    server = require('gulp-express'),
    merge = require('merge-stream'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    clean = require('gulp-clean'),
    debounce = require('debounce'),
    gIf = require('gulp-if'),
    rename = require('gulp-rename'),
    mocha = require('gulp-mocha');

var DEBUG = true;
var CODE_DIR = 'src/'
var BUILD_DIR = '_build/'


var cCoffee = function(){return gIf(/.*\.coffee/, coffee())};
var cMinify = function(){return gIf(!DEBUG, merge(concat('index.out.js'), uglify()))};

gulp.task('default', ['server', 'client']);

gulp.task('watch', ['default'], function(){
    return gulp.watch([CODE_DIR+'/**/*'], ['default']);
});

gulp.task('clean', function() {
    return gulp.src(BUILD_DIR, {read: false})
        .pipe(clean())
})

gulp.task('run', ['default'], function() {
    server.run({file: BUILD_DIR+'server/server/index.js'});
    return gulp.watch(BUILD_DIR+'**/*', debounce(server.run))
});

gulp.task('server', function() {
    return gulp.src(CODE_DIR+'/**/*')
        .pipe(cCoffee())
        .pipe(gulp.dest(BUILD_DIR+'/server/'))
});

gulp.task('client', function() {
    var all = gulp.src([CODE_DIR+'/client/**/*'])

    var css = gulp.src([CODE_DIR+'/client/**/*.css'])

    var compiled = gulp.src(CODE_DIR+'client/index.coffee', { read: false })
        .pipe(browserify({
            transform: ['coffeeify'],
            debug: DEBUG,
            insertGlobals: DEBUG,
        }))
        .pipe(rename({extname: '.js'}));

    var external = gulp.src([
        './node_modules/long/dist/Long.js',
        './node_modules/bytebuffer/dist/ByteBufferAB.js',
        './node_modules/protobufjs/dist/ProtoBuf.js',
        './node_modules/socket.io-client/socket.io.js',
        './bower_components/Keypress/keypress.js',
        './bower_components/pixi/bin/pixi.dev.js',
        './node_modules/underscore/underscore.js'
    ]);

    var javascript = merge(external, compiled)
        // .pipe(cCoffee())
        .pipe(cMinify());
    var included = merge(javascript, css)
        .pipe(gulp.dest(BUILD_DIR+'client/'));
    var html = gulp.src(CODE_DIR+'client/index.html')
        .pipe(inject(included, {ignorePath: BUILD_DIR+'client/'}))

    return merge(all, html, included)
        .pipe(gulp.dest(BUILD_DIR+'client/'));
});
