class Game {
    constructor() {
        this.health = 10
        this.startingHealth = 10
        this.money = 300
        this.startingMoney = 300
        this.score = 0
        this.currentLevel = 0
        this.director = new Director(this)
        this.buildings = []
        this.projectiles = []
    }
}

class Director {
    constructor(game) {
        this.waves = []
        this.currentWave = 0
        this.totalWaves = 5
        this.game = game
        this.enemyStats = {
          speed: 1,
          health: 100,
          scoreValue: 10,
          damageValue: 1,
          moneyValue: 25,
        }
        //This the scaling of enemy stats per wave
        this.enemyScaling = {
          speed: 1.0,
          health: 1.0,
          scoreValue: 1.0,
          damageValue: 1.0,
          moneyValue: 1.0,
        }
    }

    addWave(wave) {
        this.waves.push(wave)
    }

    getCurrentWave() {
        return this.waves[this.currentWave]
    }

    startNextWave() {
        this.waves[this.currentWave].forEach(enemy => {
            enemy.update()
        })

        if (this.waves[this.currentWave].length == 1 && this.waves[this.currentWave][0].position.x == -100) {
          this.waves[this.currentWave] = [];
          this.currentWave++;
          //Check if the next wave exists
          if (this.currentWave >= this.totalWaves) {
            //Beat the Level, so alert win
            alert("You won");

            loadLocalStorage();
            if (userInfo.currentLevel < userInfo.level) {
              if (userInfo.currentLevel == 4) {
                userInfo.currentLevel += game.score;
                save();
              }
              document.location.href='\levelselect.html';
            } else if (userInfo.currentLevel == (userInfo.level + 1)) {
              userInfo.level ++;
              userInfo.score += game.score;
              save();
              document.location.href='\levelselect.html';
            } else {
              //Current Level >= Best Level
              document.location.href='\levelselect.html';
            }
          }
        }

    }
}

class InfoUI {
    constructor(game) {
        this.game = game
    }

    draw() {
        // Menu testing
        context.fillStyle = "black"
        context.fillRect(380, 0, 524, 42)
        context.fillStyle = "#f2b230"
        context.fillRect(382, 0, 520, 40)
        context.fillStyle = "black"
        context.font = "30px serif"
        let str = "Lives: " + game.health
            + " Money: " + game.money
            + " Wave: " + (game.director.currentWave + 1)
            + " Score: " + game.score
        context.fillText(str, 390, 30)
    }
}

class PlacementTile {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.size = 32
        this.color = 'rgba(0, 0, 0, 0.03)'
        this.occupied = false
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(mouse) {
        this.draw()

        if (mouse.x > this.position.x && mouse.x < this.position.x + this.size && mouse.y > this.position.y && mouse.y < this.position.y + this.size) {
            this.color = 'lightblue'
        }
        else this.color = 'rgba(0, 0, 0, 0.03)'
    }
}

class Enemy {
    constructor(position = { x: 0, y: 0 }, game, speed=1, health=100, scoreValue=10, damageValue=1, moneyValue=25) {
        this.position = position
        this.width = 50
        this.height = 50
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        this.speed = speed
        this.health = health
        this.scoreValue = scoreValue
        this.damageValue = damageValue // How many lives it takes if it reaches end
        this.moneyValue = moneyValue // Reward for destroying enemy

        this.game = game // Game object
    }

    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)
        this.position.x += Math.cos(angle) * this.speed
        this.position.y += Math.sin(angle) * this.speed
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            Math.round(this.center.x) === Math.round(waypoint.x) &&
            Math.round(this.center.y) === Math.round(waypoint.y) &&
            this.waypointIndex < waypoints.length - 1)
            {
                this.waypointIndex++

                // Determine if enemy made it to the end
                if (this.waypointIndex == waypoints.length - 1) {
                    game.health -= this.damageValue

                    delete this // @todo: figure out how to actually remove an enemy

                    // The last enemy seems to trigger its last waypoint
                    // early, so it will still be on screen when it updates
                    // the game objects health.
                    // @todo: fix that
                    if (game.health < 1) alert("You lost!")
                }
        }
    }
}

class Building {
    constructor({position = {x:0, y:0}}, cost, game, range, firerate) {
        this.position = position
        this.width = 32
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.width / 2
        }
        this.cost = cost // How expensive it is to purchase
        this.game = game // Game object
        this.range = range // How far the tower can detect enemies
        this.firerate = firerate // Fires per second
        this.nextFire = -1
    }

    update() {
        this.draw()
        this.checkForEnemies()
        this.nextFire--
        console.log(this.nextFire)
    }

    draw() {
        context.fillStyle = 'blue'
        context.fillRect(this.position.x, this.position.y, this.width, 32)
    }

    checkForEnemies() {
        let wave = this.game.director.getCurrentWave()

        for (let i = 0; i < wave.length; i++) {
            let dist = this.distance2D(
                this.position.x, this.position.y,
                wave[i].center.x, wave[i].center.y)

            if (dist < this.range) {
                let yDistance = wave[i].center.y - this.position.y
                let xDistance = wave[i].center.x - this.position.x
                let angle = Math.atan2(yDistance, xDistance)

                let projectile = new Projectile({
                    position: {
                        x: this.center.x - 3,
                        y: this.center.y - 3
                    }
                })
                projectile.speed = 8
                projectile.damage = 25
                projectile.angle = angle
                projectile.game = this.game

                if (this.nextFire < 0) {
                    this.game.projectiles.push(projectile)
                    this.nextFire = this.firerate
                }
            }
        }
    }

    distance2D(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
    }
}

class Projectile {
    constructor({position = {x:0, y:0}}, speed, damage, game, angle, size) {
        this.position = position
        this.speed = speed
        this.damage = damage
        this.game = game
        this.angle = angle
        this.size = size
    }

    update() {
        this.position.x += Math.cos(this.angle) * this.speed
        this.position.y += Math.sin(this.angle) * this.speed

        this.draw()
        this.checkForCollision()
    }

    draw() {
        context.fillStyle = 'black'
        context.fillRect(this.position.x, this.position.y, 6, 6)
    }

    checkForCollision() {
        let wave = this.game.director.getCurrentWave()

        for (let i = 0; i < wave.length; i++) {
            let enemy = wave[i]
            let dist = this.distance2D(
                this.position.x, this.position.y,
                enemy.center.x, enemy.center.y)

            if (dist < enemy.width * 0.75) {
                // @todo: Damage enemy and destroy projectile
                enemy.health -= this.damage
                if (enemy.health < 1) {
                    enemy.speed = 0
                    enemy.position.x = -100
                    enemy.position.y = -100
                    wave.splice(i, i)

                    game.score += enemy.scoreValue
                    game.money += enemy.moneyValue
                }

                this.speed = 0
                this.position.x = -10
                this.position.y = -10
                delete this
            }
        }
    }

    distance2D(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
    }
}
