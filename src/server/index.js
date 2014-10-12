'use strict';

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    world = require('../world/index'),
    // actor = require('../world/actors')(io),
    control = require('./control'),

    ControlLoop = require('../shared/controlLoop'),

    path = require('path'),
    _ = require('underscore');

    // mongoose = require('mongoose');


app.use(express.static(path.join(__dirname, '..', 'client')));

// mongoose.connect('mongodb://localhost/pirates');

var SECRET = "K[gw/!.9D>!%B956zXM7~43U3qkv;W=0$Rm^e{;9jZ45j5AdEDsF%7Y";

server.listen(8000);
