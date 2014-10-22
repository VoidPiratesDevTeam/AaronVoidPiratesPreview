EventEmitter = require('events').EventEmitter

class ClientLine extends EventEmitter
    constructor: (@socket) ->


    identity: () ->
        return null

    connect: () ->


class ServerLine extends EventEmitter
