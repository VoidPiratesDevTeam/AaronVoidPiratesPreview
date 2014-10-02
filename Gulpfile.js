var gulp = require('gulp'),
    inject = require('gulp-inject'),
    server = require('gulp-express'),
    merge = require('merge-stream'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var DEBUG = true;

var clientJS = function() {
    var clientLibraries = gulp.src('./client/index.js', { read: false })
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
    var target = gulp.src('./client/index.html');

    var otherSources = gulp.src(
        [
            './client/index.css',
            './shared/line/messages.proto'
        ]
    )

    var sources = merge(clientJS(), otherSources)
        .pipe(gulp.dest('./_build/client/static/'));

    return target.pipe(inject(sources, {ignorePath: '_build/client/'}))
        .pipe(gulp.dest('./_build/client/'));
});


gulp.task('server', function(){
    var server, world;
    server = gulp.src('./server/**/*.js')
        .pipe(gulp.dest('./_build/server/'))
    world = gulp.src('./world/**/*.js')
        .pipe(gulp.dest('./_build/world/'))

    return merge(server, world);
});


gulp.task('assets', function(){
    return gulp.src('./client/assets/**/*')
        .pipe(gulp.dest('./_build/client/assets/'))
})


gulp.task('run', ['default'], function(){
    server.run({
        file: '_build/server/index.js'
    });
    gulp.watch('./_build/**/*', server.run)
})


gulp.task('watch', ['default'], function(){
    gulp.watch(['./**/*', '!./_build/**/*', '!./bower_components',
    '!./node_modules'], ['default'])
})


gulp.task('default', ['index', 'assets', 'server'])
