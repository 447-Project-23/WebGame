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
  game.director.enemyStats = {
    speed: 1,
    health: 100,
    scoreValue: 10,
    damageValue: 1,
    moneyValue: 25,
  }
  game.director.enemyScaling = {
    speed: 1.0,
    health: 1.0,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
  }
} else if (userInfo.currentLevel == 2) {
  game.director.totalWaves = 10
  game.director.enemyStats = {
    speed: 2,
    health: 200,
    scoreValue: 10,
    damageValue: 1,
    moneyValue: 25,
  }
  game.director.enemyScaling = {
    speed: 1.0,
    health: 1.0,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
  }
} else if (userInfo.currentLevel == 3) {
  game.director.totalWaves = 20
  game.director.enemyStats = {
    speed: 3,
    health: 300,
    scoreValue: 30,
    damageValue: 1,
    moneyValue: 25,
  }
  game.director.enemyScaling = {
    speed: 1.0,
    health: 1.0,
    scoreValue: 1.0,
    damageValue: 1.0,
    moneyValue: 1.0,
  }
} else {
  game.director.totalWaves = 100000000000
  game.director.enemyStats = {
    speed: 1,
    health: 100,
    scoreValue: 10,
    damageValue: 1,
    moneyValue: 25,
  }
  game.director.enemyScaling = {
    speed: 1.01,
    health: 1.1,
    scoreValue: 1.1,
    damageValue: 1,
    moneyValue: 1.1,
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

console.log(placementTilesData2D)


for (let j = 0; j < game.director.totalWaves; j++) {
  let wave = []
  for (let i = 1; i < 11; i++) {
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
}

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
        tower.firerate = 100

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
