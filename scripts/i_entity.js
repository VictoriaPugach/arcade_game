class EntityPlacer {
    constructor(maze) {
        this.maze = maze;
    }

    placeEntity(entityType, count, extraData = null) {
        for (let i = 0; i < count; i++) {
            this.placeSingleEntity(entityType, extraData);
        }
    }

    placeSingleEntity(entityType, extraData = null) {
        let attempts = 0;
        while (attempts < 100) {
            const x = getRandomInt(0, this.maze.width - 1);
            const y = getRandomInt(0, this.maze.height - 1);
        
            if (this.maze.tiles[y][x] === 0) {
                this.maze.tiles[y][x] = entityType;
                this.onEntityPlaced(x, y, entityType, extraData);
                return true;
            }
            attempts++;
        }
        return false;
    }

    onEntityPlaced(x, y, entityType, extraData) {
        throw new Error('onEntityPlaced must be implemented in child class');
    }
}