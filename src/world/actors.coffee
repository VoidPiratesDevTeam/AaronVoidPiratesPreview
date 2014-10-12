assert = require 'assert'
Physics = require('PhysicsJS')


class ShipActor
    constructor: (shipbits=null) ->
        @body = Physics.body 'circle', {}
        @thurstPower = 2000
        @mass = 20000
    thrustForward: (degree) =>
        assert degree>=0 && degree<=1
        @body.applyForce @thrustPower*degree


module.exports = {
    'ShipActor': ShipActor
}
