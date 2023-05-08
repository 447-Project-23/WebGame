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

/*
Set the information about the level based on current level
This is things like # of waves, enemy stats, etc.
*/

if (userInfo.currentLevel == 1) {
  game.director.totalWaves = 5
  game.money = 200
  game.director.enemyStats = {
    speed: 1,
    health: 100,
    scoreValue: 10,
    damageValue: 1,
    moneyValue: 25,
    enemies: 10,
  }
  game.director.enemyScaling = {
    speed: 1.0,
    health: 1.0,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
    enemies: 2,
  }
} else if (userInfo.currentLevel == 2) {
  game.director.totalWaves = 10
  game.money = 700
  game.director.enemyStats = {
    speed: 1.5,
    health: 200,
    scoreValue: 15,
    damageValue: 1,
    moneyValue: 25,
    enemies: 10,
  }
  game.director.enemyScaling = {
    speed: 1.05,
    health: 1.05,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
    enemies: 5,
  }
} else if (userInfo.currentLevel == 3) {
  game.director.totalWaves = 20
  game.money = 1350
  game.director.enemyStats = {
    speed: 2,
    health: 250,
    scoreValue: 25,
    damageValue: 1,
    moneyValue: 25,
    enemies: 10,
  }
  game.director.enemyScaling = {
    speed: 1.1,
    health: 1.1,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
    enemies: 10,
  }
} else {
  game.director.totalWaves = 1000
  game.money = 300
  game.director.enemyStats = {
    speed: 1,
    health: 100,
    scoreValue: 10,
    damageValue: 1,
    moneyValue: 25,
    enemies: 10,
  }
  game.director.enemyScaling = {
    speed: 1.15,
    health: 1.25,
    scoreValue: 1,
    damageValue: 1,
    moneyValue: 1,
    enemies: 10,
  }
}

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

let wave = []
for (let i = 0; i < game.director.enemyStats.enemies; i++) {
    const xOffset = i * 115
    wave.push(new Enemy(
    {
        x: waypoints[0].x - xOffset,
        y: waypoints[0].y,
    },
    game,
    (game.director.enemyStats.speed * Math.pow(game.director.enemyScaling.speed, game.director.currentWave)),
    (game.director.enemyStats.health * Math.pow(game.director.enemyScaling.health, game.director.currentWave)),
    (game.director.enemyStats.scoreValue * Math.pow(game.director.enemyScaling.scoreValue, game.director.currentWave)),
    (game.director.enemyStats.damageValue * Math.pow(game.director.enemyScaling.damageValue, game.director.currentWave)),
    (game.director.enemyStats.moneyValue * Math.pow(game.director.enemyScaling.moneyValue, game.director.currentWave)),
  ))
}   
game.director.addWave(wave)

function animate() {
    requestAnimationFrame(animate)

    context.drawImage(image, 0, 0)

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

    topbar.draw()
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
        tower.firerate = 100

        if (game.money >= tower.cost) {
            game.buildings.push(tower)

            activeTile.isOccupied = true
            game.money -= tower.cost
        }
    } else if (activeTile && activeTile.isOccupied) {
        for (let i = 0; i < game.buildings.length; i++) {
            if (game.buildings[i].position.x == activeTile.position.x && game.buildings[i].position.y == activeTile.position.y) {
                if (game.buildings[i].cost < game.money) {
                    if (game.buildings[i].level >= 4) continue
                    game.money -= game.buildings[i].cost
                    game.buildings[i].upgrade()
                }
            }
        }
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null

    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i]

        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size && mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size) {
            activeTile = tile
            break
        }
    }
})
