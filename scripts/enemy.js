// 'use strict';

class Enemies {
    constructor(maze) {
        this.maze = maze;
        this.hero = null;
        this.enemies = []; 
    }

    setHero(hero) {
        this.hero = hero;
    }

    placeItems() {
        this.placeEnemies(10);
    }

    placeEnemies(count) {
        for (let i = 0; i < count; i++) {
            this.placeItem('tileE');
        }
    }

    placeItem(itemType) {
        let attempts = 0;
        while (attempts < 100) {
            const x = getRandomInt(0, this.maze.width - 1);
            const y = getRandomInt(0, this.maze.height - 1);
        
            if (this.maze.tiles[y][x] === 0) {
                this.maze.tiles[y][x] = itemType; 
                this.enemies.push({
                    x, 
                    y,
                    health: 12,
                    maxHealth: 12,
                    attackPower: 2
                });
                return;
            }
            attempts++;
        }
    }

// Случайное движение в любом направлении
    moveRandomly() {
        const directions = [
            {dx: -1, dy: 0},  // left
            {dx: 1, dy: 0},   // right
            {dx: 0, dy: -1},  // up
            {dx: 0, dy: 1}    // down
        ];

        this.enemies.forEach((enemy, index) => {
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            this.tryMoveEnemy(enemy, randomDir.dx, randomDir.dy, index);
        });
    }

    // Движение только по одной оси (горизонтальной или вертикальной)
    moveOnSingleAxis() {
        this.enemies.forEach((enemy, index) => {
            // Выбираем случайную ось: 0 - горизонталь, 1 - вертикаль
            const axis = Math.floor(Math.random() * 2);
            
            if (axis === 0) {
                // Движение по горизонтали
                const dx = Math.random() > 0.5 ? 1 : -1;
                this.tryMoveEnemy(enemy, dx, 0, index);
            } else {
                // Движение по вертикали
                const dy = Math.random() > 0.5 ? 1 : -1;
                this.tryMoveEnemy(enemy, 0, dy, index);
            }
        });
    }

    // Поиск и атака героя
    chaseHero() {
        if (!this.hero) return;

        this.enemies.forEach((enemy, index) => {
            const dx = Math.sign(this.hero.x - enemy.x);
            const dy = Math.sign(this.hero.y - enemy.y);

            // С вероятностью 70% движемся к герою, 30% - случайно
            if (Math.random() < 0.7) {
                // Предпочитаем движение по той оси, где расстояние больше
                if (Math.abs(this.hero.x - enemy.x) > Math.abs(this.hero.y - enemy.y)) {
                    this.tryMoveEnemy(enemy, dx, 0, index);
                } else {
                    this.tryMoveEnemy(enemy, 0, dy, index);
                }
            } else {
                // Случайное движение
                const directions = [
                    {dx: -1, dy: 0}, {dx: 1, dy: 0}, 
                    {dx: 0, dy: -1}, {dx: 0, dy: 1}
                ];
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                this.tryMoveEnemy(enemy, randomDir.dx, randomDir.dy, index);
            }
        });
    }

    // Попытка перемещения врага
    tryMoveEnemy(enemy, dx, dy, index) {
        const newX = enemy.x + dx;
        const newY = enemy.y + dy;

        // Проверяем возможность перемещения
        if (newX >= 0 && newX < this.maze.width && 
            newY >= 0 && newY < this.maze.height &&
            this.maze.tiles[newY][newX] === 0) {
            
            // Освобождаем старую позицию
            this.maze.tiles[enemy.y][enemy.x] = 0;
            
            // Занимаем новую позицию
            enemy.x = newX;
            enemy.y = newY;
            this.maze.tiles[newY][newX] = 'tileE';

        }
    }

    // Универсальный метод для движения (можно выбрать стратегию)
    moveEnemies(strategy = 'random') {
        switch(strategy) {
            case 'random':
                this.moveRandomly();
                break;
            case 'single-axis':
                this.moveOnSingleAxis();
                break;
            case 'chase':
                this.chaseHero();
                break;
            default:
                this.moveRandomly();
        }

        // Вызываем render если он передан
        if (this.render && typeof this.render === 'function') {
            this.render();
        }
    }

    // Нанесение урона врагу
    takeDamage(x, y, damage) {
        const enemyIndex = this.enemies.findIndex(e => e.x === x && e.y === y);
        if (enemyIndex !== -1) {
            this.enemies[enemyIndex].health -= damage;
            console.log(`Враг получил ${damage} урона. Осталось здоровья: ${this.enemies[enemyIndex].health}`);
            
            if (this.enemies[enemyIndex].health <= 0) {
                console.log('Враг убит!');
                this.maze.tiles[y][x] = 0; // Убираем врага с карты
                this.enemies.splice(enemyIndex, 1);
                return true;
            }
        }
        return false;
    }
    
    // Атака героя всеми соседними врагами
    attackHero(hero) {
        let attacked = false;
        
        this.enemies.forEach(enemy => {
            const distX = Math.abs(enemy.x - hero.x);
            const distY = Math.abs(enemy.y - hero.y);
            
            if (distX <= 1 && distY <= 1) {
                console.log('Враг атакует героя!');
                hero.takeDamage(2);
                attacked = true;
            }
        });
        
        return attacked;
    }
    
    getEnemyHealthHTML(x, y) {
        const enemy = this.enemies.find(e => e.x === x && e.y === y);
        if (enemy) {
            const percent = (enemy.health / 12) * 100;
            return `<div class="health" style="width: ${percent}%"></div>`;
        }
        return '';
    }
}
