class Game {
    constructor() {
        this.health = 10
        this.startingHealth = 10
        this.money = 300
        this.startingMoney = 300
        this.score = 999 // just testing
        this.director = new Director()
        this.buildings = []
        this.projectiles = []
    }
}

class Director {
    constructor() {
        this.waves = []
        this.currentWave = 0
        this.totalWaves = 5
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

        // @todo: update wave counter once the wave is finished
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
    constructor({position = { x: 0, y: 0 }}, game) {
        this.position = position
        this.width = 50
        this.height = 50
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        this.health = 100 
        this.damageValue = 1 // How many lives it takes if it reaches end
        this.moneyValue = 25 // Reward for destroying enemy

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
        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
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
    }

    update() {
        this.draw()
        this.checkForEnemies()
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
                        x: this.center.x - 4,
                        y: this.center.y - 4
                    }                    
                })
                projectile.speed = 100
                projectile.damage = 50
                projectile.game = this.game

                this.game.projectiles.push(projectile)
                // @todo: Fire projectile at enemy
            }
        }
    }

    distance2D(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
    }
}

class Projectile {
    constructor({position = {x:0, y:0}}, speed, damage, game) {
        this.position = position
        this.speed = speed
        this.damage = damage
        this.game = game
    }

    update() {
        this.draw()
        this.checkForCollision()
    }

    draw() {
        context.fillStyle = 'black'
        context.fillRect(this.position.x, this.position.y, 8, 8)
    }

    checkForCollision() {
        let wave = this.game.director.getCurrentWave()

        for (let i = 0; i < wave.length; i++) {
            let dist = this.distance2D(
                this.position.x, this.position.y,
                wave[i].center.x, wave[i].center.y)

            if (dist < wave[i].width) {
                // @todo: Damage enemy and destroy projectile
            }
        }
    }

    distance2D(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
    }
}
