EventEmitter = require('events').EventEmitter


class ControlLoop extends EventEmitter
    constructor: (@hertz) ->
        @_lastTick = null
        @ongoing = false

    setStep: (@hertz) =>
        @stop()
        @start()

    tick: =>
        delta = (@_milliTime() - @_lastTick)
        @_stampTime()
        this.emit 'tick', delta

    start: =>
        if not @ongoing
            @_stampTime()
        @ongoing = true
        setInterval @tick, (1000/@hertz)

    stop: =>
        @ongoing = false
        clearInterval @tick

    _stampTime: =>
        @_lastTick = @_milliTime()

    _milliTime: =>
        new Date().getTime()

module.exports = ControlLoop
