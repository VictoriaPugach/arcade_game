class Enemies extends EntityPlacer {
    constructor(maze) {
        super(maze);
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
        this.placeEntity('tileE', count, {
            health: 12,
            maxHealth: 12,
            attackPower: 2
        });
    }

    onEntityPlaced(x, y, entityType, extraData) {
        if (entityType === 'tileE' && extraData) {
            this.enemies.push({
                x, 
                y,
                health: extraData.health,
                maxHealth: extraData.maxHealth,
                attackPower: extraData.attackPower
            });
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

    // Движение только по одной оси
    moveOnSingleAxis() {
        this.enemies.forEach((enemy, index) => {
            const axis = Math.floor(Math.random() * 2);
            
            if (axis === 0) {
                const dx = Math.random() > 0.5 ? 1 : -1;
                this.tryMoveEnemy(enemy, dx, 0, index);
            } else {
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

            if (Math.random() < 0.7) {
                if (Math.abs(this.hero.x - enemy.x) > Math.abs(this.hero.y - enemy.y)) {
                    this.tryMoveEnemy(enemy, dx, 0, index);
                } else {
                    this.tryMoveEnemy(enemy, 0, dy, index);
                }
            } else {
                const directions = [
                    {dx: -1, dy: 0}, {dx: 1, dy: 0}, 
                    {dx: 0, dy: -1}, {dx: 0, dy: 1}
                ];
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                this.tryMoveEnemy(enemy, randomDir.dx, randomDir.dy, index);
            }
        });
    }

    tryMoveEnemy(enemy, dx, dy, index) {
        const newX = enemy.x + dx;
        const newY = enemy.y + dy;

        if (newX >= 0 && newX < this.maze.width && 
            newY >= 0 && newY < this.maze.height &&
            this.maze.tiles[newY][newX] === 0) {
            
            this.maze.tiles[enemy.y][enemy.x] = 0;
            
            enemy.x = newX;
            enemy.y = newY;
            this.maze.tiles[newY][newX] = 'tileE';

        }
    }

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

        if (this.render && typeof this.render === 'function') {
            this.render();
        }
    }

    takeDamage(x, y, damage) {
        const enemyIndex = this.enemies.findIndex(e => e.x === x && e.y === y);
        if (enemyIndex !== -1) {
            this.enemies[enemyIndex].health -= damage;
            // console.log(`Враг получил ${damage} урона. Осталось здоровья: ${this.enemies[enemyIndex].health}`);
            
            if (this.enemies[enemyIndex].health <= 0) {
                // console.log('Враг убит!');
                this.maze.tiles[y][x] = 0; // Убираем врага с карты
                this.enemies.splice(enemyIndex, 1);
                return true;
            }
        }
        return false;
    }
    
    attackHero(hero) {
        let attacked = false;
        
        this.enemies.forEach(enemy => {
            const distX = Math.abs(enemy.x - hero.x);
            const distY = Math.abs(enemy.y - hero.y);
            
            if (distX <= 1 && distY <= 1) {
                // console.log('Враг атакует героя');
                hero.takeDamage(enemy.attackPower);
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
