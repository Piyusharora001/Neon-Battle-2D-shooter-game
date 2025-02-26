// Enhanced 2D Shooter Game with Responsive Design
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
document.body.style.textAlign = "center";
document.body.style.background = "#1e1e1e";

// Responsive canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Player Object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: Math.min(canvas.width, canvas.height) * 0.03,
    speed: Math.min(canvas.width, canvas.height) * 0.005,
    dx: 0,
    dy: 0,
    bullets: [],
    health: 3
};

// Enemy Object
const enemies = [];
const enemySpeed = Math.min(canvas.width, canvas.height) * 0.002;
let score = 0;
let gameOver = false;

// Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
    if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
    if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    if (e.key === " " && !gameOver) shoot();
});

window.addEventListener("keyup", (e) => {
    if (["ArrowUp", "w", "ArrowDown", "s"].includes(e.key)) player.dy = 0;
    if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) player.dx = 0;
});

// Shoot bullets
function shoot() {
    player.bullets.push({ x: player.x + player.size / 2 - 2.5, y: player.y, speed: Math.min(canvas.width, canvas.height) * 0.01 });
}

// Spawn enemies
function spawnEnemy() {
    if (!gameOver) {
        enemies.push({ x: Math.random() * (canvas.width - 30), y: 0, size: Math.min(canvas.width, canvas.height) * 0.04 });
        setTimeout(spawnEnemy, 1500);
    }
}
spawnEnemy();

// Update Game
function update() {
    if (gameOver) return;

    player.x += player.dx;
    player.y += player.dy;

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
    
    // Move bullets
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });
    
    // Move enemies & check collisions
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemySpeed;
        
        // Check player collision
        if (
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y
        ) {
            player.health--;
            enemies.splice(eIndex, 1);
            if (player.health <= 0) {
                gameOver = true;
            }
        }
        
        // Check bullet collision
        player.bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.size &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.size &&
                bullet.y + 10 > enemy.y
            ) {
                score++;
                enemies.splice(eIndex, 1);
                player.bullets.splice(bIndex, 1);
            }
        });
    });
}

// Draw Game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = "#252525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player
    ctx.fillStyle = "#00bfff";
    ctx.fillRect(player.x, player.y, player.size, player.size);
    
    // Draw Bullets
    ctx.fillStyle = "#ff4500";
    player.bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    
    // Draw Enemies
    ctx.fillStyle = "#ff0000";
    enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size));
    
    // Draw Score & Health
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Health: ${player.health}`, 10, 60);
    
    // Draw Game Over
    if (gameOver) {
        ctx.fillStyle = "yellow";
        ctx.font = "50px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
    }
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
