actorsCache = {}
stage = new PIXI.Stage(0x66FF99)

buildView = ->
    renderer = PIXI.autoDetectRenderer(window.innerWidth-80, window.innerHeight-80)

    animate = ->
        renderer.render(stage)
        requestAnimFrame( animate )
    requestAnimFrame(animate)

    return renderer.view

updateActor = (actor) ->
    sprite = null

    if actor.id in actorsCache
        sprite = actorsCache[actor.id]
    else
        texture = PIXI.Texture.fromImage(actor.image_path)
        sprite = actorsCache[actor.id] = new PIXI.Sprite(texture)
        sprite.anchor.x = 0.5
        sprite.anchor.y = 0.5

        stage.addChild(sprite)
    sprite.position.x = actor.x
    sprite.position.y = actor.y
    sprite.rotation = actor.r

module.exports = {
    stage: stage,
    buildView: buildView,
    updateActor: updateActor,
}
