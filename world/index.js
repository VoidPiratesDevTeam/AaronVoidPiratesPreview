Physics = require('PhysicsJS');

var world = Physics();

b = Physics.body('circle', {});
world.add(b);


var worldStep = function(){
    var lastTime = new Date().getMilliseconds(),
        step = function(){
            var delta = (new Date().getMilliseconds() - lastTime);
            world.step(delta);
        }
    return setInterval(step, 100);
}
worldStep();

module.exports = world;
