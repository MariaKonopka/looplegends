const canvas = document.querySelector('canvas') //tela
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const speed = 4
const speedFireball = 6
const fireballs = []

let score = 0;
let startTime = Date.now();
let gameRunning = true;

class Player { //jogador
    constructor({ position, velocity }) {
        this.position = position // (x,y)
        this.velocity = velocity
    }

    draw() {  //desenhar jogador
        c.save()

        c.fillStyle = "red"
        c.beginPath()
        c.fillRect(this.position.x, this.position.y, 60, 60)
        c.fill

        c.restore()
    }

    update() {
        if (!gameRunning) {
            return;
        }
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Verificar colisão com bolas de fogo
        for (let i = fireballs.length - 1; i >= 0; i--) {
            const fireball = fireballs[i];
    
            // Calcular a distância entre o jogador e a bola de fogo
            const distance = Math.sqrt(
                Math.pow(this.position.x - fireball.position.x, 2) +
                Math.pow(this.position.y - fireball.position.y, 2)
            );
    
            // Se houver colisão, encerra o jogo
            if (distance < 40 + fireball.radius) {
                endGame();
                return;
            }
        }
    }
}


class Fireball {
    constructor({ position, velocity, radius }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.closePath()
        c.strokeStyle = 'black'
        c.stroke()
        c.fillStyle = 'orange'
        c.fill()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


const player = new Player({
    position: { x: screen.width / 2 + 30, y: screen.height / 2 - 30 },
    velocity: { x: 0, y: 0 },
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

window.setInterval(() => {
    const index = Math.floor(Math.random() * 2)
    let x, y
    let vx, vy
    let radius = 40

    switch (index) {
        case 0: //Sapwn Bola de Fogo Direita
            x = 0 + radius
            y = Math.random() * canvas.height
            vx = +speedFireball
            vy = 0
            break
        case 1: //Spawn Bola de Fogo em Baixo
            x = Math.random() * canvas.width
            y = canvas.height + radius
            vx = 0
            vy = -speedFireball
            break
        case 2: //Spawn Bola de Fogo Esquerda
            x = canvas.width - radius
            y = Math.random() * canvas.height
            vx = speedFireball
            vy = 0
            break
        case 3: //Spawn Bola de Fogo em Cima
            x = Math.random() * canvas.width
            y = 0 - radius
            vx = 0
            vy = speedFireball
            break
    }

    fireballs.push(
        new Fireball({
            position: { x: x, y: y, },
            velocity: { x: vx, y: vy, },
            radius,
        })
    )

}, 200)

function animate() {
    if (gameRunning) {
        window.requestAnimationFrame(animate)
        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
        player.update()

        //gerar Bola de Fogo
        for (let i = fireballs.length - 1; i >= 0; i--) {
            const fireball = fireballs[i]
            fireball.update()

            //remover Bola de Fogo
            if (
                fireball.position.x + fireball.radius < 0 ||
                fireball.position.x - fireball.radius > canvas.width ||
                fireball.position.y - fireball.radius > canvas.height ||
                fireball.position.y + fireball.radius < 0
            ) {
                fireballs.splice(i, 1)
            }
        }

        // Calcular o tempo decorrido
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) /100;

        // Exibir o tempo na tela
        c.fillStyle = 'black';
        c.font = '30px Arial';
        c.fillText('Score: ' + elapsedTime.toFixed(0), 20, 30);

        // parar instantaneo ao inves de desacelerar
        //player.velocity.y = 0
        //player.velocity.x = 0
        if (keys.w.pressed) {
            player.velocity.y = -speed
        } else if (keys.s.pressed) {
            player.velocity.y = speed
        }

        if (keys.a.pressed) {
            player.velocity.x = -speed
        } else if (keys.d.pressed) {
            player.velocity.x = speed
        } else if ((!keys.w.pressed) || (!keys.a.pressed) || (!keys.s.pressed) || (!keys.d.pressed)) {
            //desacelerar ao inves de parar instante
            player.velocity.x *= .88
            player.velocity.y *= .88
        }

    }
}

animate()

function endGame() {
        if (gameRunning) {
            gameRunning = false;
            fireballs.length = 0; // Limpar o array de bolas de fogo
            c.fillStyle = 'black';
            c.font = '50px Arial';
            c.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        }
    }

window.addEventListener('keydown', (movement) => {
    switch (movement.code) {
        case 'KeyW':
            keys.w.pressed = true
            break
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        case 'KeyS':
            keys.s.pressed = true
            break
    }
})

window.addEventListener('keyup', (movement) => {
    switch (movement.code) {
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
        case 'KeyS':
            keys.s.pressed = false
            break
    }
})


