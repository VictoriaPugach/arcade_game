class Enemies {
    constructor(maze) {
        this.maze = maze;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
            const x = this.getRandomInt(0, this.maze.width - 1);
            const y = this.getRandomInt(0, this.maze.height - 1);
        
            if (this.maze.tiles[y][x] === 0) {
                this.maze.tiles[y][x] = itemType; 
                return;
            }
            attempts++;
        }
    }
}