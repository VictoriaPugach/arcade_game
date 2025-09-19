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
        let attempts = 0;
        while (attempts < 50) { 
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
        let newX = this.x + dx;
        let newY = this.y + dy;

        // Проверяем, можно ли переместиться (не стена и в пределах карты)
        if (newX >= 0 && newX < this.maze.width && 
            newY >= 0 && newY < this.maze.height &&
            this.maze.tiles[newY][newX] !== 1) {
            
            // Освобождаем старую позицию
            this.maze.tiles[this.y][this.x] = 0;
            
            // Занимаем новую позицию
            this.x = newX;
            this.y = newY;
            this.maze.tiles[this.y][this.x] = 'tilePwosw';
            
            return true;
        }
        
        // Если уперлись в границу - проверяем, находимся ли в коридоре
        if (this.isInPassage()) {
            return this.teleportToOppositeSide(dx, dy);
        }
        
        return false;
    }

    // Проверяем, находится ли герой в коридоре
    isInPassage() {
        // Коридор - это клетка со значением 0 (проход)
        return this.maze.tiles[this.y][this.x] === 0 || 
               this.maze.tiles[this.y][this.x] === 'tilePwosw';
    }

    // Телепортация на противоположную сторону прохода
    teleportToOppositeSide(dx, dy) {
        let newX = this.x;
        let newY = this.y;
        
        // Ищем противоположный конец прохода
        if (dx !== 0) { // Движение по горизонтали
            newX = this.findPassageEnd(this.x, this.y, dx, 0);
        } else if (dy !== 0) { // Движение по вертикали
            newY = this.findPassageEnd(this.x, this.y, 0, dy);
        }
        
        // Если нашли валидную позицию для телепортации
        if (newX !== this.x || newY !== this.y) {
            // Освобождаем старую позицию
            this.maze.tiles[this.y][this.x] = 0;
            
            // Телепортируемся
            this.x = newX;
            this.y = newY;
            this.maze.tiles[this.y][this.x] = 'tilePwosw';
            
            return true;
        }
        
        return false;
    }

    // Ищем конец прохода в заданном направлении
    findPassageEnd(startX, startY, dx, dy) {
        let x = startX;
        let y = startY;
        
        // Двигаемся в обратном направлении до конца прохода
        while (true) {
            const nextX = x - dx;
            const nextY = y - dy;
            
            // Проверяем, не вышли ли за границы
            if (nextX < 0 || nextX >= this.maze.width || 
                nextY < 0 || nextY >= this.maze.height) {
                break;
            }
            
            // Проверяем, не стена ли
            if (this.maze.tiles[nextY][nextX] === 1) {
                break;
            }
            
            x = nextX;
            y = nextY;
        }
        
        return dx !== 0 ? x : y;
    }

    moveLeft() { return this.move(-1, 0); }
    moveUp() { return this.move(0, -1); }
    moveDown() { return this.move(0, 1); }
    moveRight() { return this.move(1, 0); }
}