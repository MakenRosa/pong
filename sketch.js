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
        this.w = 40; // Changed the width to 40
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
        
        this.y = constrain(this.y, this.h / 1.5, height - this.h / 1.5);
    }

    draw() {
        if (this.x < width / 2) {
            push();
            translate(this.x, this.y); 
            rotate(-0.5);
            image(bat, 0, 0, this.w, this.h);
            pop();
        }
        if (this.x > width / 2) {
            push();
            translate(this.x, this.y); 
            rotate(2.5);
            image(bat, 0, 0, this.w, this.h);
            pop();
        }
        
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
        if (this.y < this.r || this.y > height - this.r) {
            this.vy *= -1;
        }

        if (collidesWithCircle(jogador.x, jogador.y, jogador.w, jogador.h, this.x, this.y, this.r)) {
            bounce.play();
            this.vx *= -1.1; 
            this.vy *= 1.1;  
        }
        if (collidesWithCircle(oponente.x, oponente.y, oponente.w, oponente.h, this.x, this.y, this.r)) {
            bounce.play();
            this.vx *= -1.1; 
            this.vy *= 1.1;  
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
    bat = loadImage('Beater_Bat.png'); 
    background = loadImage('quidditch.jpeg');
    bounce = loadSound('hit.wav');
    goal = loadSound('goal.mp3');
}

function falaPontos() {
    // use speechapi
    if ('speechSynthesis' in window) {
        let msg = new SpeechSynthesisUtterance();
        msg.text = "Grifinória " + playerScore + ", Sonserina " + opponentScore;
        msg.lang = 'pt-BR';
        speechSynthesis.speak(msg);
    }
}

function setup() {
    createCanvas(800, 400);
    ball = new Ball();
    jogador = new Paddle(30);
    oponente = new Paddle(width - 30);
}

function draw() {
    image(background, 0, 0, width, height);
    ball.update();
    ball.draw();
    jogador.update();
    jogador.draw();
    oponente.update();
    oponente.draw();
}
