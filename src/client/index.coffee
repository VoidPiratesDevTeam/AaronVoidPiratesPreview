document.addEventListener 'DOMContentLoaded', ->

    rendering = require './rendering.coffee'

    # Server Communication

    ProtoBuf = dcodeIO.ProtoBuf;
    messages = ProtoBuf.loadProtoFile("/messages.proto")
    Action = messages.build("Action")
    ActorList = messages.build("ActorList")
    ClientMessage = messages.build("ClientMessage")

    socket = io()

    socket.on 'actorsList', (data)->
        actors = ActorList.decode(data);
        for i in actors.actors
            actor = actors.actors[i]

            rendering.updateActor(actor)

    socket.on 'identifyClient', () ->
        socket.emit 'identity', localStorage.getItem 'identity'

    socket.on 'nameClient', (data) ->
        localStorage.setItem 'identity', data

    # Key Events
    KEY_MAP = {
        0: 'up',
        1: 'down',
        2: 'right',
        3: 'left'
    };

    listener = new keypress.Listener()
    key_positions = {}

    key_handler = (key_id, type)->
        ->
            msg = new ClientMessage()
            if type == 'down'
                key_positions[key_id] = true
            else
                delete key_positions[key_id]
            for key in key_positions
                msg.actions.push Number(key)
            socket.emit 'clientMessage', msg.toBuffer()

    map_keys = (map)->
        listener.reset()

        for key in map
            value = map[key]
            listener.register_combo
                keys: value,
                on_keydown: key_handler(key, 'down'),
                on_keyup: key_handler(key, 'up'),
                prevent_repeat: true,

        return listener

    map_keys(KEY_MAP)

    # Rendering

    document.body.appendChild(rendering.buildView());

, false
