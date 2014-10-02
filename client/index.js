document.addEventListener('DOMContentLoaded', function(){
    'use strict';

    var rendering = require('./rendering');

    /* Server Communication */

    var ProtoBuf = dcodeIO.ProtoBuf;
    var messages = ProtoBuf.loadProtoFile("/static/messages.proto"),
        Action = messages.build("Action"),
        ActorList = messages.build("ActorList"),
        ClientMessage = messages.build("ClientMessage");

    var socket = io();

    var actorsCache = {};

    socket.on('actorsList', function(data){
        var actors = ActorList.decode(data);
        for (var i in actors.actors) {
            var actor = actors.actors[i];

            var sprite;

            if (actor.id in actorsCache) {
                sprite = actorsCache[actor.id];
            }
            else {
                var texture = PIXI.Texture.fromImage(actor.image_path);
                sprite = actorsCache[actor.id] = new PIXI.Sprite(texture);
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;

                stage.addChild(sprite);
            }
            sprite.position.x = actor.x;
            sprite.position.y = actor.y;
            sprite.rotation = actor.r;
        }
    });

    /* Key Events */
    var KEY_MAP = {
        0: 'up',
        1: 'down',
        2: 'right',
        3: 'left'
    };

    var listener = new keypress.Listener();
    var key_positions = {};

    function key_handler(key_id, type){
        return function(){
            var msg = new ClientMessage();
            if (type === 'down') {
                key_positions[key_id] = true;
            }
            else {
                delete key_positions[key_id];
            }
            for (var key in key_positions) {msg.actions.push(Number(key));}
            socket.emit('clientMessage', msg.toBuffer());
        };
    }

    function map_keys(map){
        listener.reset();

        for (var key in map) {
            var value = map[key];
            listener.register_combo({
                keys: value,
                on_keydown: key_handler(key, 'down'),
                on_keyup: key_handler(key, 'up'),
                prevent_repeat: true,
            });
        }

        return listener;
    }
    map_keys(KEY_MAP);

    /* Rendering */

    var stage = new PIXI.Stage(0x66FF99);
    var renderer = PIXI.autoDetectRenderer(window.innerWidth-80, window.innerHeight-80);
    document.body.appendChild(renderer.view);

    function animate() {
        renderer.render(stage);
        requestAnimFrame( animate );
    }
    requestAnimFrame(animate);


}, false);
