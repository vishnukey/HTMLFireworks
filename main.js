const DEFAULT_COLOUR = "#000000"

const SECONDS = 1000
const MILIS = 1

const DEG2RAD = Math.PI / 180

const FIREWORK_START_Y = window.innerHeight - 10

const COLOURS = [
        "#FF0000", // red
        "#00FF00", // green
        "#0000FF", // blue
        //"#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        //"#000000", // black
]

async function main(){
        const cnv = document.querySelector("#canvas")
        resizeCanvas(cnv)()
        window.onresize = resizeCanvas(cnv)
}

const resizeCanvas = cnv => _ => {
        cnv.width = window.innerWidth
        cnv.height = window.innerHeight
}

const clearCtx = ctx => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

const randomRange = (lb, ub) => Math.random() * (ub - lb) + lb
const randomChoice = arr => arr[Math.floor(randomRange(0, arr.length))]

const updatables = []
const drawables = []

const registerObj = obj => {
        if (obj && obj.hasOwnProperty("draw")) drawables.push(obj)
        if (obj && obj.hasOwnProperty("update")) updatables.push(obj)
}

const unregisterObj = obj => {
        if (obj && obj.hasOwnProperty("draw"))
                drawables.splice(
                        drawables.indexOf(obj),
                        1)
        if (obj && obj.hasOwnProperty("update"))
                updatables.splice(
                        updatables.indexOf(obj),
                        1)
}

const drawCircle = (ctx, x, y, radius, colour) => {
        ctx.fillStyle = colour
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill()
        ctx.fillStyle = DEFAULT_COLOUR
}

async function startFireworks(){
        console.log("Starting fireworkds")
        const cnv = document.querySelector("#canvas")
        const ctx = cnv.getContext("2d")
        clearCtx(ctx)

        const fireworkConfig = {
                lifetime : randomRange(1 * SECONDS, 2 * SECONDS),
                dx: randomRange(-0.01, 0.01)
        }

        for (let i = 0; i < 20; i++){
                const fireworkConfig = {
                        lifetime : randomRange(0.3 * SECONDS, 4 * SECONDS),
                        dx: randomRange(-0.05, 0.05),
                        speed: randomRange(0.1, 0.3),
                        delay: randomRange(10, 1 * SECONDS) * i
                }
                const startX = Math.round(randomRange(50, window.innerWidth))
                registerObj(new Firework(startX, randomChoice(COLOURS), fireworkConfig))
        }

        let prevTime = undefined
        let totalTime = 0

        function frame(timeStamp){
                //init
                if (!prevTime) prevTime = timeStamp
                const elapsedTime = timeStamp - prevTime
                prevTime = timeStamp

                //update
                for (const obj of updatables) obj.update(elapsedTime)

                // drawing
                clearCtx(ctx)
                for (const obj of drawables) obj.draw(ctx)

                // Cleanup and advancing conditions
                totalTime += elapsedTime
                if (!(updatables.length == 0 && drawables.length == 0)) // stop after 3 seconds
                        window.requestAnimationFrame(frame)
                else{
                        clearCtx(ctx)
                        console.log("Firworkds over")
                }
        }

        window.requestAnimationFrame(frame)
}

function Firework(
        initX,
        colour,
        {
                lifetime = 2 * SECONDS,
                speed = 0.1,
                dx = 0.01,
                delay = 0,
                drag = 0.001,
                trail_length = 50,
                explode = true
        } = {}){
        this.x = initX
        this.y = FIREWORK_START_Y
        this.past_points = []
        this.size = 3
        this.colour = colour
        this.time = 0
        this.lifetime = lifetime
        this.speed = speed
        this.dx = dx
        this.delay = delay
        this.drag = drag
        this.trail_length = trail_length
        this.explode = explode

        this.draw = ctx => {
                if (this.time < this.delay) return
                drawCircle(ctx, this.x, this.y, this.size, this.colour)

                if (this.past_points.length > this.trail_length) {
                        this.past_points.shift()
                }

                ctx.strokeStyle = this.colour
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                for (const {x, y} of this.past_points.reverse()) {
                        ctx.lineTo(x, y)
                        ctx.moveTo(x, y)
                }
                this.past_points.reverse()
                ctx.stroke()
                ctx.strokeStyle = DEFAULT_COLOUR

                this.past_points.push({x: this.x, y: this.y})
        }

        this.update = elapsedTime => {
                this.time += elapsedTime
                if (this.time < this.delay) return

                this.y -= this.speed * elapsedTime
                this.x += this.dx * elapsedTime
                this.speed -= this.drag

                if (this.time > this.lifetime + this.delay) {
                        unregisterObj(this)
                        if (!this.explode) return
                        const lines = 10
                        for (let i = 0; i < lines; i++){
                                const angle_deg = 360 * (i / lines)
                                const angle_rad = angle_deg * DEG2RAD
                                const dx = Math.cos(angle_rad)
                                const dy = Math.sin(angle_rad)
                                const config = {
                                        lifetime : 0.8 * SECONDS,
                                        speed : dy * 0.1,
                                        dx : dx * 0.1,
                                        drag : this.drag,
                                        explode : false
                                }
                                const expl = new Firework(0, this.colour, config)
                                expl.x = this.x
                                expl.y = this.y
                                expl.size = 1
                                registerObj(expl)
                        }
                }
        }
}
