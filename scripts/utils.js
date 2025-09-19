function getRandomInt(min, max){
    return Math.round(Math.random()*(max - min) + min);
}

function isMazeReady(maze) {
    return maze && maze.tiles && maze.tiles.length > 0 && maze.tiles[0].length > 0;
}

function isIntersects(RectA, RectB) {
    return (RectA[0] < RectB[2] && 
            RectA[2] > RectB[0] &&
            RectA[3] > RectB[1] &&
            RectA[1] < RectB[3]);
}

const FIELD_HEIGHT = 40;
const FIELD_WIDTH = 24;
const TILE_HEIGHT = 3; 