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
        this.speedY = Math.random() * 3 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.sparks = [];
        this.exploded = false;
        this.gravity = 0.03;
    }

    update() {
        this.y -= this.speedY;
        this.speedY -= this.gravity;

        if (this.speedY <= 0 && !this.exploded) {
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
            this.drawReflection();
        } else {
            this.sparks.forEach(spark => spark.update());
            this.sparks.forEach(spark => spark.draw());
            this.drawReflection();
        }
    }

    drawReflection() {
        const reflectionY = water.y + (water.y - this.y);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, reflectionY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Spark {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.color = color;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.gravity = 0.05;
        this.alpha = 1;
        this.friction = 0.98;
    }

    update() {
        this.speedX *= this.friction;
        this.speedY *= this.friction;
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
        this.drawReflection();
        ctx.globalAlpha = 1;
    }

    drawReflection() {
        const reflectionY = water.y + (water.y - this.y);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, reflectionY, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Water {
    constructor() {
        this.y = canvas.height * 0.7;
        this.height = canvas.height * 0.3;
        this.waves = [];
        this.maxWaves = 5;
        this.waveHeight = 20;
        this.waveLength = 100;
        this.speed = 0.02;

        for (let i = 0; i < canvas.width; i += this.waveLength) {
            this.waves.push({
                x: i,
                y: this.y,
                amplitude: Math.random() * this.waveHeight,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 0, 50, 0.9)';
        ctx.fillRect(0, this.y, canvas.width, this.height);
        this.drawRefraction();
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

    updateWaves() {
        ctx.save();
        ctx.translate(0, this.y);
        ctx.beginPath();

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            wave.phase += this.speed;
            wave.y = Math.sin(wave.phase) * wave.amplitude;
            ctx.lineTo(wave.x, wave.y);
            wave.x += this.speed;

            if (wave.x > canvas.width) {
                wave.x = 0;
            }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 100, 0.6)';
        ctx.fill();
        ctx.restore();
    }

    drawRefraction() {
        const moonRefractionX = moon.x + (Math.sin(Date.now() * 0.001) * 5);
        const moonRefractionY = this.y + 10;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(moonRefractionX - 50, moonRefractionY);
        ctx.lineTo(moonRefractionX + 50, moonRefractionY);
        ctx.lineTo(moonRefractionX + 50, moonRefractionY + 100);
        ctx.lineTo(moonRefractionX - 50, moonRefractionY + 100);
        ctx.clip();

        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(255, 255, 224, ${0.05 + i * 0.01})`;
            ctx.fillRect(moonRefractionX - 50 + (i % 2 ? i : -i), moonRefractionY + i, 100, 1);
        }

        ctx.restore();
    }
}

class Cloud {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5;
        this.width = Math.random() * 200 + 100;
        this.height = this.width * 0.5;
        this.speedX = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        if (this.x > canvas.width) this.x = -this.width;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Moon {
    constructor() {
        this.x = canvas.width * 0.8;
        this.y = canvas.height * 0.2;
        this.radius = 50;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 224, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        this.drawRefraction();
    }

    drawRefraction() {
        const reflectionX = this.x;
        const reflectionY = water.y + (water.y - this.y);
        ctx.fillStyle = 'rgba(255, 255, 224, 0.5)';
        ctx.beginPath();
        ctx.arc(reflectionX, reflectionY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

const fireworks = [];
const water = new Water();
const clouds = Array.from({ length: 5 }, () => new Cloud());
const moon = new Moon();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o céu
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar a lua
    moon.draw();

    // Desenhar as nuvens
    clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
    });

    // Desenhar a água e atualizar as ondas
       // Desenhar a água e atualizar as ondas
       water.draw();
       water.updateWaves();
   
       // Desenhar fogos de artifício
       fireworks.forEach((firework, index) => {
           firework.update();
           firework.draw();
           water.reflect(firework);
           if (firework.sparks.length === 0 && firework.exploded) {
               fireworks.splice(index, 1);
           }
       });
   
       requestAnimationFrame(animate);
   }
   
   canvas.addEventListener('click', (e) => {
       const firework = new Firework();
       firework.x = e.clientX;
       firework.y = canvas.height;
       fireworks.push(firework);
   });
   
   animate();
   
