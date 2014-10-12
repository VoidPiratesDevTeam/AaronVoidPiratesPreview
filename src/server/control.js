var path = require('path'),
    ProtoBuf = require('protobufjs');

var PROTOPATH = path.join(__dirname, '..', 'client', 'static', 'messages.proto')

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

var sockets = [];

var actorHighId = 0;


var tick = function() {
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

}

var controlLoop = function(){
    var lastTime = new Date().getMilliseconds(),
        step = function(){
            for (socket in sockets){
                socket.emit
            }
        }
    return setInterval(step, 100);
}
controlLoop();

var io;
module.exports = function(io) {
    io = io;
    io.use(require('socket.io-cookie'));

}
