'use strict';

var ProtoBuf = require('protobufjs'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    world = require('../world/index'),
    _ = require('underscore');

    // mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost/pirates');

var PROTOPATH = path.join(__dirname, '..', 'client', 'static', 'messages.proto')
var SECRET = "K[gw/!.9D>!%B956zXM7~43U3qkv;W=0$Rm^e{;9jZ45j5AdEDsF%7Y";

var builder = ProtoBuf.loadProtoFile(PROTOPATH),
    Actor = builder.build("Actor"),
    ClientMessage = builder.build("ClientMessage"),
    ActorList = builder.build("ActorList"),
    Action = builder.build("Action");

var actors = new ActorList();
var actor = {};
actor.x = 0;
actor.y = 0;
actor.r = 1;
actor.id = 0;
actor.image_path = "/assets/bolt.png";
actors.actors.push(actor);

app.use(express.static(path.join(__dirname, '..', 'client')));

io.use(require('socket.io-cookie'));
io.on('connection', function(socket){
    socket.emit('actorsList', actors.toBuffer());
    socket.on('clientMessage', function(data){
        var msg = ClientMessage.decode(data);
        if (_.contains(msg.actions, Action.FORWARD)){
            actor.y += 3;
        }
        if (_.contains(msg.actions, Action.BACKWARD)){
            actor.y -= 3;
        }
        if (_.contains(msg.actions, Action.RIGHT)){
            actor.r -= .1;
        }
        if (_.contains(msg.actions, Action.LEFT)){
            actor.r += .1;
        }
        socket.emit('actorsList', actors.toBuffer());
    })
});

server.listen(8000);
