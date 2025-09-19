class Hero {
    constructor(maze) {
        this.maze = maze;
        this.x = 0;
        this.y = 0;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    placeItems() {
        // this.placeHero(1);
    }

    placeHero(count) {
        for (let i = 0; i < count; i++) {
            this.placeItem('tilePwosw');
        }
    }

    placeItem(itemType) {
        let attempts = 0;
        while (attempts < 100) {
            const x = this.getRandomInt(0, this.maze.width - 1);
            const y = this.getRandomInt(0, this.maze.height - 1);
        
            if (this.maze.tiles[y][x] === 0) {
                this.maze.tiles[y][x] = itemType; 
                return;
            }
            attempts++;
        }
    }

  async findStartPosition() {
        // Ждем полной загрузки карты
        let attempts = 0;
        while (attempts < 50) { // Максимум 5 секунд ожидания
            if (this.isMazeReady()) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!this.maze || !this.maze.tiles) {
            console.error('Maze or tiles is not initialized');
            return false;
        }

        // Ищем первую свободную клетку для старта
        for (let y = 0; y < this.maze.height; y++) {
            if (!this.maze.tiles[y]) {
                console.warn(`Row ${y} is undefined in maze tiles`);
                continue;
            }
            
            for (let x = 0; x < this.maze.width; x++) {
                if (this.maze.tiles[y][x] === undefined) {
                    console.warn(`Tile [${y}][${x}] is undefined`);
                    continue;
                }
                
                if (this.maze.tiles[y][x] === 0) {
                    this.x = x;
                    this.y = y;
                    this.maze.tiles[y][x] = 'tilePwosw';
                    console.log(`Hero placed at: ${x}, ${y}`);
                    return true;
                }
            }
        }
        console.error('No free space found for hero');
        return false;
    }

    isMazeReady() {
        // Простая проверка - есть ли хотя бы одна свободная клетка
        return this.maze && 
               this.maze.tiles && 
               this.maze.tiles.length > 0 &&
               this.maze.tiles[0].length > 0;
    }
    
move(dx, dy) {
    console.log(`Attempting move from: ${this.x}, ${this.y}`);
    
    const newX = this.x + dx;
    const newY = this.y + dy;
    console.log(`Attempting to move to: ${newX}, ${newY}`);

    // Проверяем, можно ли переместиться
    if (newX >= 0 && newX < this.maze.width && 
        newY >= 0 && newY < this.maze.height) {
        
        console.log(`Target tile value: ${this.maze.tiles[newY][newX]}`);
        
        if (this.maze.tiles[newY][newX] !== 1) {
            // Движение возможно
            this.maze.tiles[this.y][this.x] = 0;
            this.x = newX;
            this.y = newY;
            this.maze.tiles[this.y][this.x] = 'tilePwosw';
            console.log(`Moved successfully to: ${this.x}, ${this.y}`);
            return true;
        }
    }
    console.log('Move blocked');
    return false;
}

    moveLeft() { return this.move(-1, 0); }
    moveUp() { return this.move(0, -1); }
    moveDown() { return this.move(0, 1); }
    moveRight() { return this.move(1, 0); }
}