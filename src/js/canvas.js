import platform from '../img/platformv2-export.png'
import background from '../img/bg-test.png'
// import hills from '../img/hills.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const gravity = 2

class Player {
    constructor(){
        this.position = {
            x:100,
            y:100
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width = 66,
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0

        this.sprites = {
            stand : {
                right:createImage(spriteStandRight),
                left:createImage(spriteStandLeft),
                cropWidth:177,
                width:66
            },
            run : {
                right:createImage(spriteRunRight),
                left:createImage(spriteRunLeft),
                cropWidth:340,
                width:127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177

    }

    draw(){
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth ,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update(){
        this.frames++

        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left))
        this.frames = 0
        else if (this.frames >29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
        this.frames = 0


        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform{
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        image.addEventListener('load', () => {
            this.width = image.width;
            this.height = image.height;
          });
        
        
    }
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


class GenericObject{
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        image.addEventListener('load', () => {
            this.width = image.width;
            this.height = image.height;
          });
        
        
    }
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}


const platformImage = createImage(platform)
const image = new Image()
image.src = platform

const player = new Player()

const genericObjects = [
    new GenericObject({
        x:-1,
        y:-1,
        image : createImage(background)
    })
    // new GenericObject({
    //     x:-1,
    //     y:-1,
    //     image : createImage(hills)
    // })
]
const platforms = [new Platform({
    x:-1,
    y:500,
    image : platformImage
}), new Platform({
    x: 500, //normalement image.width mais ça fonctionnne pas
    y:500,
    image
}),
new Platform({
    x: 1000, //normalement image.width mais ça fonctionnne pas
    y:500,
    image: platformImage
}),
new Platform({
    x: 1500, //normalement image.width mais ça fonctionnne pas
    y:500,
    image: platformImage
})]
let lastKey
const keys = {
    right:{
        pressed:false
    },
    left:{
        pressed:false
    }

}

let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })

    player.update()
    

    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5
    }else if ((keys.left.pressed && player.position.x >100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0){
    player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if(keys.right.pressed){
            platforms.forEach(platform => {
                scrollOffset += 10
                platform.position.x -= 10
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= 3
            })
        } else if (keys.left.pressed && scrollOffset > 0){
            platforms.forEach(platform => {
                scrollOffset -= 10
                platform.position.x += 10
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += 3
            })
            
        }
    } 

    //détéction de collision
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })

    //sprite switching
    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }
    
}

animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode)
    switch(keyCode){
        case 81:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'

        break
        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
        break
        case 90:
            console.log('up')
            player.velocity.y -= 20
        break
        case 83:
            console.log('down')
        break
    }
    console.log(keys.right.pressed)
})


addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode){
        case 81:
            console.log('left')
            keys.left.pressed = false
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        break
        case 68:
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        break
        case 90:
            console.log('up')
            player.velocity.y -= 20
        break
        case 83:
            console.log('down')
        break
    }
    console.log(keys.left.pressed)
})