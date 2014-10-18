Physics = require 'PhysicsJS'
ControlLoop = require '../utils/ControlLoop'

world = new Physics()

worldLoop = new ControlLoop 10

worldLoop.on 'tick', (delta)->world.step delta
