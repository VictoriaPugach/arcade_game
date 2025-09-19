'use strict';

class Game {
    constructor() {
        this.field = document.getElementsByClassName('field')[0];
        this.maze = new Maze(40, 24);
        this.items = new Items(this.maze);
        this.enemies = new Enemies(this.maze);
        this.hero = new Hero(this.maze);

        this.isPaused = false;
        this.gameInterval = null;
        this.enemyMoveInterval = null;

        this.setupControls();
        this.setupUI();
    }

    setupUI(){
        this.pauseBtn = document.getElementsByClassName('btn-pause')[0];
        this.resumeBtn = document.getElementsByClassName('btn-resume')[0];
        this.restartBtn = document.getElementsByClassName('btn-replay')[0];
        
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.resumeBtn.addEventListener('click', () => this.resumeGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }

 setupControls() {
        document.addEventListener('keydown', (event) => {
            if (this.isPaused) return;
            
            let action = false;
            
            switch(event.key.toLowerCase()) {
                case 'w': action = this.hero.moveUp(); break;
                case 'a': action = this.hero.moveLeft(); break;
                case 's': action = this.hero.moveDown(); break;
                case 'd': action = this.hero.moveRight(); break;
                case ' ': action = this.handleAttack(); break; // Пробел для атаки
            }
            
            if (action) {
                // После движения или атаки враги атакуют героя
                this.enemies.attackHero(this.hero);
                this.renderAllTiles();
                
                // Проверяем смерть героя
                if (this.hero.health <= 0) {
                    this.gameOver();
                }
            }
        });
    }

    renderFullWall() {
        this.field.innerHTML = '';
        this.field.style.display = 'grid';
        this.field.style.gridTemplateColumns = `repeat(${this.maze.width}, 1fr)`;
        this.field.style.gridTemplateRows = `repeat(${this.maze.height}, 1fr)`;
        
        for (let i = 0; i < this.maze.width * this.maze.height; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tileW');
            this.field.appendChild(tile);
        }
    }

    async animateRooms() {
        for (const room of this.maze.rooms) {
            const {x, y, width, height} = room;
            
            for (let dy = y; dy < y + height; dy++) {
                for (let dx = x; dx < x + width; dx++) {
                    if (dy < this.maze.height && dx < this.maze.width) {
                        const index = dy * this.maze.width + dx;
                        const tile = this.field.children[index];
                        if (tile  && this.maze.tiles[dy][dx] !== 1) {
                            tile.classList.remove('tileW');
                            tile.classList.add('tile');
                            await new Promise(resolve => setTimeout(resolve, 10));
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async animateItems() {
    console.log('Animating items...');
    
    for (let y = 0; y < this.maze.height; y++) {
        for (let x = 0; x < this.maze.width; x++) {
            const tileType = this.maze.tiles[y][x];
            // Проверяем предметы
            if (tileType === 'tileSW' || tileType === 'tileHP' || tileType === 'tileE' || tileType === "tilePwosw" || tileType === "tileP") {
                const index = y * this.maze.width + x;
                const tile = this.field.children[index];
                if (tile) {
                    tile.classList.remove('tileW', 'tile');
                    tile.classList.add(tileType);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }
    }
}

    async animatePassages() {
        console.log('Animating passages...');
        
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                if (this.maze.tiles[y][x] !== 1) {
                    const index = y * this.maze.width + x;
                    const tile = this.field.children[index];
                    if (tile && tile.classList.contains('tileW')) {
                        tile.classList.remove('tileW');
                        tile.classList.add('tile');
                        await new Promise(resolve => setTimeout(resolve, 2));
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

   renderAllTiles() {
    this.field.innerHTML = '';
    for (let y = 0; y < this.maze.height; y++) {
        for (let x = 0; x < this.maze.width; x++) {
            const tile = document.createElement('div');
            const tileType = this.maze.tiles[y][x];
            
            if (tileType === 1) {
                tile.className = 'tileW';
            } else if (tileType === 0) {
                tile.className = 'tile';
            } else {
                tile.className = tileType;
                
                // ДОБАВЛЯЕМ health ВНУТРЬ плитки
                if (tileType === 'tileP' || tileType === 'tilePwosw') {
                    tile.innerHTML = this.hero.getHealthHTML();
                } else if (tileType === 'tileE') {
                    tile.innerHTML = this.enemies.getEnemyHealthHTML(x, y);
                }
            }
            
            this.field.appendChild(tile);
        }
    }
}

     pauseGame() {
        if (this.isPaused) return;
        
        this.isPaused = true;
        console.log('Game paused');
        
        // Останавливаем интервалы
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.enemyMoveInterval) clearInterval(this.enemyMoveInterval);
        
        // Обновляем UI
        this.pauseBtn.style.display = 'none';
        this.resumeBtn.style.display = 'block';
        
        // Сохраняем состояние игры (опционально)
        this.saveGameState();
    }

    // Продолжение игры
    resumeGame() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        console.log('Game resumed');
        
        // Запускаем интервалы снова
        this.startGameIntervals();
        
        // Обновляем UI
        this.pauseBtn.style.display = 'block';
        this.resumeBtn.style.display = 'none';
    }

    // Переключение паузы
    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    // Перезапуск игры
    restartGame() {
        // Очищаем все интервалы
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.enemyMoveInterval) clearInterval(this.enemyMoveInterval);
        
        // Сбрасываем состояние
        this.isPaused = false;
        
        // Перезапускаем игру
        this.init().then(() => {
            console.log('Game restarted');
        });
    }

    // Запуск игровых интервалов
    startGameIntervals() {
        // Очищаем старые интервалы
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.enemyMoveInterval) clearInterval(this.enemyMoveInterval);
        
        // Основной игровой цикл (если нужен)
        this.gameInterval = setInterval(() => {
            if (!this.isPaused) {
                // Логика обновления игры
            }
        }, 1000 / 60); // 60 FPS
        
        // Движение врагов
        this.enemyMoveInterval = setInterval(() => {
            if (!this.isPaused && this.enemies) {
                this.enemies.moveEnemies('chase');
                this.renderAllTiles();
            }
        }, 1000);
    }

    // Сохранение состояния игры (опционально)
    saveGameState() {
        const gameState = {
            maze: this.maze.tiles,
            hero: { x: this.hero.x, y: this.hero.y },
            enemies: this.enemies.enemies,
            items: this.getItemsState() // нужно реализовать
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    // Загрузка состояния игры (опционально)
    loadGameState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const state = JSON.parse(savedState);
            // Восстанавливаем состояние
            this.maze.tiles = state.maze;
            this.hero.x = state.hero.x;
            this.hero.y = state.hero.y;
            this.enemies.enemies = state.enemies;
            // this.restoreItemsState(state.items); // нужно реализовать
            return true;
        }
        return false;
    }

    handleAttack() {
        console.log('Атака пробелом! Сила:', this.hero.attack);
        let hitCount = 0;
        
        // Наносим урон всем соседним врагам
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                
                const x = this.hero.x + dx;
                const y = this.hero.y + dy;
                
                if (x >= 0 && x < this.maze.width && 
                    y >= 0 && y < this.maze.height &&
                    this.maze.tiles[y][x] === 'tileE') {
                    
                    const killed = this.enemies.takeDamage(x, y, this.hero.attack);
                    if (killed) hitCount++;
                    console.log(`Атакован враг на ${x},${y}`);
                }
            }
        }
        
        if (hitCount > 0) {
            console.log(`Убито врагов: ${hitCount}`);
            return true;
        }
        return false;
    }
    
    gameOver() {
        console.log('💀 Игра окончена!');
        alert('GAME OVER - Вы погибли!');
    }


    async init() {
        try {
            // Пытаемся загрузить сохраненное состояние
            if (this.loadGameState()) {
                console.log('Game state loaded from storage');
            } else {
                // Инициализируем новую игру
                this.maze.init();
                this.maze.generateRooms();
                this.maze.generatePassages(); 
                this.items.placeItems();
                this.enemies.placeItems();
                
                this.renderFullWall();
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.animateRooms();
                await new Promise(resolve => setTimeout(resolve, 300));
                this.animatePassages(); 
                await new Promise(resolve => setTimeout(resolve, 300));
                await this.animateItems();

                await this.hero.findStartPosition();
                this.hero.placeItems();
            }

            this.enemies.setHero(this.hero);
            this.startGameIntervals();
            
            console.log('Game initialized!');
            
        } catch (error) {
            console.error('Error:', error);
        }
    }
}