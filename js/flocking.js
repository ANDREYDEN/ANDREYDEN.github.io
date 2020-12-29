const FLOCK_SIZE = 100
const IMPACT_ZONE = 75
const REPULTION_ZONE = 30
const MOUSE_REPULTION_ZONE = 60
const MAX_VEL = 4
const MAX_FORCE = 3
const ATTRACTION_COEF = 0.01
const REPULTION_COEF = 0.5
const MOUSE_REPULTION_COEF = 2
const sketch = p => {

    class Agent {
        constructor(pos) {
            this.pos = pos
            this.vel = p5.Vector.random2D()
            this.acc = new p5.Vector()
        }

        move() {
            this.acc.limit(MAX_FORCE)
            this.vel.add(this.acc)
            this.vel.limit(MAX_VEL)
            this.pos.add(this.vel)
        }

        getNeighbourhood(flock) {
            return flock.filter(agent => agent.pos.dist(this.pos) < IMPACT_ZONE && agent !== this)
        }

        align(neighbours) {
            if (neighbours.length === 0) return

            let avgVel = neighbours.reduce((acc, cur) => acc.add(cur.vel), new p5.Vector())
            avgVel.div(neighbours.length)

            this.acc.add(avgVel)
        }

        attract(neighbours) {
            if (neighbours.length === 0) return

            let avgPos = neighbours.reduce((acc, cur) => acc.add(cur.pos), new p5.Vector())
            avgPos.div(neighbours.length)
            let attractionForce = avgPos.sub(this.pos)

            this.acc.add(attractionForce.mult(ATTRACTION_COEF))
        }

        repel(neighbours, impactZone, coef) {
            if (neighbours.length === 0) return

            let repulsiveForce = neighbours.reduce((acc, cur) => {
                const dist = this.pos.dist(cur.pos)
                if (dist > impactZone) return acc
                const otherPos = new p5.Vector(cur.pos.x, cur.pos.y)
                const thisPos = new p5.Vector(this.pos.x, this.pos.y)
                return acc.add(thisPos.sub(otherPos).setMag(impactZone / dist))
            },
                new p5.Vector()
            )

            this.acc.add(repulsiveForce.mult(coef))
        }

        passThroughWalls() {
            this.pos.x = (this.pos.x + window.innerWidth) % window.innerWidth
            this.pos.y = (this.pos.y + window.innerHeight) % window.innerHeight
        }

        display() {
            p.noStroke()
            p.fill(0, 50)
            p.ellipse(this.pos.x, this.pos.y, 10, 10)
        }
    }

    const flock = []

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight)
        for (let i = 0; i < FLOCK_SIZE; i++) {
            flock.push(new Agent(
                new p5.Vector(
                    Math.floor(Math.random() * window.innerWidth),
                    Math.floor(Math.random() * window.innerHeight)
                )
            ))
        }
    }
    
    p.draw = () => {
        p.background(255)
        flock.forEach(agent => {
            const neighbourhood = agent.getNeighbourhood(flock)
    
            agent.align(neighbourhood)
            agent.attract(neighbourhood)
            agent.repel(neighbourhood, REPULTION_ZONE, REPULTION_COEF)
            const mouse = new Agent(new p5.Vector(p.mouseX, p.mouseY))
            agent.repel([mouse], MOUSE_REPULTION_ZONE, MOUSE_REPULTION_COEF)
    
            agent.move()
            agent.passThroughWalls()
            agent.display()
        })
    }
}

new p5(sketch, 'background');