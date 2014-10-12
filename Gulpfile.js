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
    mocha = require('gulp-mocha');

var DEBUG = true;
var CODE_DIR = 'src/'
var BUILD_DIR = '_build/'

var clientJS = function() {
    var clientLibraries = gulp.src(CODE_DIR+'client/index.js', { read: false })
        .pipe(browserify({
            debug: DEBUG,
            insertGlobals: DEBUG,
        }));

    var externalLibraries = gulp.src([
        './node_modules/long/dist/Long.js',
        './node_modules/bytebuffer/dist/ByteBufferAB.js',
        './node_modules/protobufjs/dist/ProtoBuf.js',
        './node_modules/socket.io-client/socket.io.js',
        './bower_components/Keypress/keypress.js',
        './bower_components/pixi/bin/pixi.dev.js',
        './node_modules/underscore/underscore.js'
    ]);

    var result = merge(clientLibraries, externalLibraries);

    if (!DEBUG) {
        result = result
            .pipe(concat('client.js'))
            .pipe(uglify());
    }

    return result;
};


gulp.task('index', function () {
    var target = gulp.src(CODE_DIR+'client/index.html');

    var otherSources = gulp.src(
        [
            CODE_DIR+'client/index.css',
            CODE_DIR+'shared/line/messages.proto'
        ]
    )

    var sources = merge(clientJS(), otherSources)
        .pipe(gulp.dest(BUILD_DIR+'client/static/'));

    return target.pipe(inject(sources, {ignorePath: BUILD_DIR+'client/'}))
        .pipe(gulp.dest(BUILD_DIR+'client/'));
});


gulp.task('server', function(){
    var server, world;
    server = gulp.src(CODE_DIR+'server/**/*.js')
        .pipe(gulp.dest(BUILD_DIR+'server/'))

    shared = gulp.src(CODE_DIR+'shared/**/*.js')
    sharedCoffee = gulp.src(CODE_DIR+'shared/**/*.coffee')
        .pipe(coffee())
    merge(shared, sharedCoffee)
        .pipe(gulp.dest(BUILD_DIR+'shared/'))

    worldCoffee = gulp.src(CODE_DIR+'world/**/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest(BUILD_DIR+'world/'))

    world = gulp.src(CODE_DIR+'world/**/*.js')
        .pipe(gulp.dest(BUILD_DIR+'world/'))


    return merge(server, world);
});


gulp.task('assets', function(){
    return gulp.src(CODE_DIR+'client/assets/**/*')
        .pipe(gulp.dest(BUILD_DIR+'client/assets/'))
})


gulp.task('run', ['default'], function(){
    server.run({
        file: BUILD_DIR+'server/index.js'
    });
    return gulp.watch(BUILD_DIR+'**/*', debounce(server.run))
})

gulp.task('test', ['default'], function(){
    moveTests = gulp.src('test/**/*.js')
        .pipe(gulp.dest(BUILD_DIR+'test/'))
    tests = gulp.src(BUILD_DIR+'test/**/*.js', {read: false})
        .pipe(mocha());
    return merge(moveTests, tests);
});

gulp.task('watch', ['default'], function(){
    return gulp.watch(
        [CODE_DIR+'/**/*'],
        ['default']
    )
})

gulp.task('clean', function(){
    return gulp.src(BUILD_DIR+'', {read: false})
        .pipe(clean());
})

gulp.task('default', ['index', 'assets', 'server'])
