const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#ff6666', '#66ff66', '#6666ff', '#ffff66', '#ff66ff', '#66ffff'];

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedY = Math.random() * 3 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.sparks = [];
        this.exploded = false;
    }

    update() {
        this.y -= this.speedY;
        if (this.y < canvas.height * 0.3 && !this.exploded) {
            this.explode();
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.sparks.push(new Spark(this.x, this.y, this.color));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.sparks.forEach(spark => spark.update());
            this.sparks.forEach(spark => spark.draw());
        }
    }
}

class Spark {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.color = color;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.gravity = 0.05;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Water {
    constructor() {
        this.y = canvas.height * 0.7;
        this.height = canvas.height * 0.3;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 0, 50, 0.9)';
        ctx.fillRect(0, this.y, canvas.width, this.height);
    }

    reflect(firework) {
        if (!firework.exploded) return;

        firework.sparks.forEach(spark => {
            const reflectionX = spark.x;
            const reflectionY = this.y + (this.y - spark.y);
            ctx.fillStyle = spark.color;
            ctx.globalAlpha = spark.alpha * 0.5;
            ctx.beginPath();
            ctx.arc(reflectionX, reflectionY, spark.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }
}

const fireworks = [];
const water = new Water();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o céu
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar a água
    water.draw();

    // Atualizar e desenhar fogos de artifício
    if (Math.random() < 0.1) {
        fireworks.push(new Firework());
    }
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        water.reflect(firework);

        if (firework.exploded && firework.sparks.every(spark => spark.alpha <= 0)) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    water.y = canvas.height * 0.7;
    water.height = canvas.height * 0.3;
};

animate();
