var module;
!function() {
    'use strict';
    if (!module) {
        VP = {};
        var module = VP.Rendering = {exports: {}};
    }

    var stage;

    module.exports.buildView = function() {
        stage = new PIXI.Stage(0x66FF99);
        var renderer = PIXI.autoDetectRenderer(window.innerWidth-80, window.innerHeight-80);

        function animate() {
            renderer.render(stage);
            requestAnimFrame( animate );
        }
        requestAnimFrame(animate);

        return renderer.view;
    }

    module.exports.stage = stage;
}();
