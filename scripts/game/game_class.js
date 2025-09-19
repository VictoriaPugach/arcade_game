'use strict';

class Game {
    constructor() {
        this.field = document.getElementsByClassName('field')[0];
        this.maze = new Maze(40, 24);
        this.items = new Items(this.maze);
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
            if (tileType === 'tileSW' || tileType === 'tileHP') {
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

    addPlayer() {
        console.log('Adding player...');
    }

    addEnemies() {
        console.log('Adding enemies...');
    }

    // addItems() {
    //     console.log('Adding items...');
    // }

    async init() {
        try {
            this.maze.init();
            this.maze.generateRooms();
            this.maze.generatePassages(); 
            this.items.placeItems();

            this.renderFullWall();
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.animateRooms();
            await new Promise(resolve => setTimeout(resolve, 300));
            this.animatePassages(); 
            await new Promise(resolve => setTimeout(resolve, 300));

            await this.animateItems();

            // this.addItems();
            this.addPlayer();
            this.addEnemies();
            
            console.log('Game initialized!');
            
        } catch (error) {
            console.error('Error:', error);
        }
    }
}