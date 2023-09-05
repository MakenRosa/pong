let goles;
let bat;
let background;
let bounce;
let goal;

let playerScore = 0;
let opponentScore = 0;

class Paddle {
    constructor(x) {
        this.x = x;
        this.y = height / 2;
        this.w = 20;
        this.h = 60;
        this.vy = 0;
    }

    update() {
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            const diff = ball.y - this.y;
            if (Math.abs(diff) > 10) {
                this.vy = diff / 10;
            }
            this.y += this.vy;
        }
        
        this.y = constrain(this.y, barHeight + this.h / 2, height - barHeight - this.h / 2);
    }

    draw() {
        fill(139, 69, 19); // Cor marrom
        rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h); 
    }
}

function collidesWithCircle(rectX, rectY, rectW, rectH, circleX, circleY, circleR) {
    const nearestX = constrain(circleX, rectX - rectW / 2, rectX + rectW / 2);
    const nearestY = constrain(circleY, rectY - rectH / 2, rectY + rectH / 2);
  
    const dx = nearestX - circleX;
    const dy = nearestY - circleY;
  
    const distance = sqrt(dx * dx + dy * dy);

    return distance < circleR;
}

class Ball {
    constructor() {
        this.r = 25;
        this.reset();
        this.angle = 0;
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 5;
        this.angle = 0;
        goal.play();
        falaPontos();
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += Math.PI / 64;
        if (this.x < this.r || this.x > width - this.r) {
            // aumenta o placar do jogador
            if (this.x < this.r) {
                opponentScore++;
            }
            // aumenta o placar do oponente
            if (this.x > width - this.r) {
                playerScore++;
            }
            this.reset();
        }
        if (this.y < this.r + barHeight || this.y > height - this.r - barHeight) {
            this.vy *= -1;
        }

        if (collidesWithCircle(jogador.x, jogador.y, jogador.w, jogador.h, this.x, this.y, this.r)) {
            bounce.play();
            this.vx *= -1.1;
            let deltaY = this.y - jogador.y;  // Diferença entre o centro do paddle e o ponto de colisão
            this.vy = deltaY * 0.1;  // Alterar velocidade vertical com base no ponto de colisão
        }
        if (collidesWithCircle(oponente.x, oponente.y, oponente.w, oponente.h, this.x, this.y, this.r)) {
            bounce.play();
            this.vx *= -1.1;
            let deltaY = this.y - oponente.y;  // Diferença entre o centro do paddle e o ponto de colisão
            this.vy = deltaY * 0.1;  // Alterar velocidade vertical com base no ponto de colisão
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        image(goles, -this.r, -this.r, this.r * 2, this.r * 2);
        pop();
        }
}

let ball;

function preload() {
    goles = loadImage('goles.png');
    background = loadImage('quidditch.jpeg');
    bounce = loadSound('hit.wav');
    goal = loadSound('goal.mp3');
}

function falaPontos() {
    if ('speechSynthesis' in window) {
        let msg = new SpeechSynthesisUtterance();
        msg.text = "Grifinória " + playerScore + ", Sonserina " + opponentScore;
        msg.lang = 'pt-BR';
        speechSynthesis.speak(msg);
    }
}

let barHeight = 20; // Altura das barras douradas

function setup() {
    createCanvas(800, 400);
    ball = new Ball();
    jogador = new Paddle(30);
    oponente = new Paddle(width - 30);
}

function draw() {
    image(background, 0, 0, width, height);

    // Desenhar barras douradas
    fill(255, 215, 0); // Cor dourada
    rect(0, 0, width, barHeight); // Barra superior
    rect(0, height - barHeight, width, barHeight); // Barra inferior

    ball.update();
    ball.draw();
    jogador.update();
    jogador.draw();
    oponente.update();
    oponente.draw();
}
