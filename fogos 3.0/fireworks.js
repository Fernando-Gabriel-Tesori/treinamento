const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distanceToTarget = this.calculateDistance(x, y, targetX, targetY);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 5;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 60 + 40;
        this.targetRadius = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
    }

    calculateDistance(x1, y1, x2, y2) {
        const xDistance = x2 - x1;
        const yDistance = y2 - y1;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = this.calculateDistance(this.x, this.y, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {
            this.createParticles(this.targetX, this.targetY);
            this.playSound();
            return true;
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    createParticles(x, y) {
        let particleCount = 50 + Math.floor(Math.random() * 50); // Variação na quantidade de partículas
        while (particleCount--) {
            particles.push(new Particle(x, y, this.color));
        }
    }

    playSound() {
        const sound = new Audio('https://www.fesliyanstudios.com/play-mp3/6965');
        sound.volume = 0.3;
        sound.play();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 60 + 40;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
        this.color = color;
        this.size = Math.random() * 3 + 1; // Variação no tamanho das partículas

        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
    }

    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            return true;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.alpha})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${this.alpha / 2})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const fireworks = [];
const particles = [];
const maxFireworks = 5;
const maxParticles = 400;

function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    fireworks.forEach((firework, index) => {
        if (firework.update()) {
            fireworks.splice(index, 1);
        } else {
            firework.draw();
        }
    });

    particles.forEach((particle, index) => {
        if (particle.update()) {
            particles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    if (fireworks.length < maxFireworks) {
        fireworks.push(new Firework(canvas.width / 2, canvas.height, Math.random() * canvas.width, Math.random() * canvas.height / 2));
    }
}

canvas.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    fireworks.push(new Firework(canvas.width / 2, canvas.height, x, y));
});

window.onload = loop;
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
