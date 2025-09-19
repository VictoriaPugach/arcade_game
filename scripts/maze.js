// Отрисовка производится очисткой <div class=”field”></div> и добавлением в него 
// <div class=”tile”></div> 

// 0) 40*24 map
// 0) fill with tiles
// // 1) rand 5-10 rectangles 3-8 sides
// 2) 3 - 5 horizontal and vertical lines 1 lines wide


class Maze {
    constructor(width, height) {
        this.width = width || 40;
        this.height = height || 24;
        this.tiles = [];
        this.rooms = [];
    }

    init() {
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(1); // 1 = стена
            }
            this.tiles.push(row);
        }
        this.rooms = [];
    }

    generateRooms() {
        const rectMap = [];
        this.rooms = [];
        const N = getRandomInt(5, 10);

        for (let n = 0; n < N; n++) {
            const w = getRandomInt(3, 8);
            const h = getRandomInt(3, 8);
            let placed = false; //TODO
            let attempts = 0; // TODO

            while (!placed && attempts < 100) {
                attempts++;
                const x1 = getRandomInt(1, this.width - w - 1);
                const y1 = getRandomInt(1, this.height - h - 1);
                const tempRect = [x1, y1, x1 + w, y1 + h];

                let intersects = false;
                for (const rect of rectMap) {
                    if (isIntersects(tempRect, rect)) {
                        intersects = true;
                        break;
                    }
                }

                if (!intersects) {
                    rectMap.push(tempRect);
                    this.rooms.push({ x: x1, y: y1, width: w, height: h });

                    for (let y = y1; y < y1 + h; y++) {
                        for (let x = x1; x < x1 + w; x++) {
                            if (y < this.height && x < this.width) {
                                this.tiles[y][x] = 0; // false - floor
                            }
                        }
                    }
                    placed = true;
                }
            }
        }
    }

    generatePassages() {
        const usedX = new Set();
        const usedY = new Set();
    
        for (let i = 0; i < getRandomInt(3, 5); i++) {
            let x, attempts = 0;
            do {
                x = getRandomInt(1, this.width - 2);
            } while (attempts++ < 50 && (usedX.has(x-1) || usedX.has(x) || usedX.has(x+1)));
        
            usedX.add(x);
            for (let y = 0; y < this.height; y++) this.tiles[y][x] = 0;
        }

        for (let i = 0; i < getRandomInt(3, 5); i++) {
            let y, attempts = 0;
            do {
                y = getRandomInt(1, this.height - 2);
            } while (attempts++ < 50 && (usedY.has(y-1) || usedY.has(y) || usedY.has(y+1)));
        
            usedY.add(y);
            for (let x = 0; x < this.width; x++) this.tiles[y][x] = 0;
        }
    }
}
