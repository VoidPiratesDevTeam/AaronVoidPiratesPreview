Physics = require 'PhysicsJS'

class Actor
    constructor: () ->
        @body = null

    attach: (world) ->
        @body = Physics.body 'circle', 
            x: 30,
            y: 20,
            radius: 5
        world.add @body
