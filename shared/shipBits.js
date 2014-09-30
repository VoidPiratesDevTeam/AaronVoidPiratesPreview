/*
Utils
=====
*/

var slotMap = {
    x: 0,
    y: 0,
    classes = ['chasis'],
}

/*
Chasis
======

Attributes
----------
Mass
Hitmap
Sprite
SlotMap

*/

var chasisBase = {
    class: 'chasis',
    baseCost: 3000,

    hitPoints: 10000,
    mass: 3000,
    sprites: ['./img.png'],
    spriteCenter: {x: 0, y: 0},
    centerOfMass: {x: 0, y: 0},
    hitMap: [
        {x: 0, y: 10},
        {x: 5, y: 10},
    ],
    slotMap: [
        {x: 5, y: 10, r: .3}
    ]
}
