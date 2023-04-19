loadLocalStorage();

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const mouse = {
    x: undefined,
    y: undefined
}

const placementTilesData2D = []
const placementTiles = []

const game = new Game()
const topbar = new InfoUI(game)

let activeTile = undefined

const image = new Image()
image.onload = () => {
    animate()
}
image.src = '../img/map_64.png'

canvas.width = 1280
canvas.height = 768

context.fillStyle = 'white'
context.fillRect(0, 0, canvas.width, canvas.height)

for (let i = 0; i < placementTilesData.length; i += 40)
    placementTilesData2D.push(placementTilesData.slice(i, i + 40))

placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 44) {
            placementTiles.push(new PlacementTile({
                position: {
                    x:x * 32, y:y * 32
                }
            }))
        }
    })
})

console.log(placementTilesData2D)

let wave1 = [] // Could maybe predefine these (?)
for (let i = 1; i < 11; i++) {
    const xOffset = i * 115
    wave1.push(new Enemy({
        position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
        game: game
    }))
}
game.director.addWave(wave1)

function animate() {
    requestAnimationFrame(animate)

    context.drawImage(image, 0, 0)

    topbar.draw()

    game.director.startNextWave()

    placementTiles.forEach(tile => {
        tile.update(mouse)
    })

    game.buildings.forEach(building => {
        building.update()
    })

    game.projectiles.forEach(projectile => {
        projectile.update()
    })
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied) {
        let tower = new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        });
        tower.cost = 100 // @todo: fix constructor and put these in
        tower.game = game
        tower.range = 225
        tower.firerate = 1

        if (game.money >= tower.cost) {
            game.buildings.push(tower)

            activeTile.isOccupied = true
            game.money -= tower.cost
        }
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null

    // @todo: Fix cursor coordinates
    // Game doesn't account for centering of canvas, so they are offset

    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i]

        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size && mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size) {
            activeTile = tile
            break
        }
    }
})
