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
    
        // Вертикальные проходы
        for (let i = 0; i < getRandomInt(3, 5); i++) {
            let x, attempts = 0;
            do {
                x = getRandomInt(1, this.width - 2);
            } while (attempts++ < 50 && (usedX.has(x-1) || usedX.has(x) || usedX.has(x+1)));
        
            usedX.add(x);
            for (let y = 0; y < this.height; y++) this.tiles[y][x] = 0;
        }

        // Горизонтальные проходы  
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


// const field = document.getElementsByClassName('field')[0];


// // 0 - free , 1 - wall
// function initMap(){
//     maze.tiles = []; // WHY?
   
//     for (let y = 0; y < 24; y++){
//         for (let x = 0; x < 40; x++){
//             maze.tiles.push(true); // true - wall, false - free
//         }
//     }
//     maze.rooms = []; // WHY
// }


// field.style.display = 'grid';
// field.style.gridTemplateColumns = 'repeat(40, 1fr)';
// field.style.gridTemplateRows = 'repeat(24, 1fr)';

// function renderFullWall() {
//     field.innerHTML = '';
//     for (let i = 0; i < 40 * 24; i++) {
//         let tile = document.createElement('div');
//         tile.classList.add('tileW');
//         field.appendChild(tile);
//     }
// }


// let rectMap = [];


// // // if (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
// // //     RectA.Y2 > RectB.Y1 && RectA.Y1 < RectB.Y2) 

// // // rect = [x1, y1, x2, y2]
// function isIntersects(RectA, RectB) {
//     let flag_intersects = false;

//     if (RectA[0] < RectB[2] && 
//         RectA[2] > RectB[0] &&
//         RectA[3] > RectB[1] &&
//         RectA[1] < RectB[3])
//         flag_intersects = true;

//     return flag_intersects;
// }



// // function generateRooms() {
// //     let N = getRandomInt(5, 10);
// //     let rectMap = [];
    
// //     for (let n = 0; n < N; n++) {
// //         let w = getRandomInt(3, 8);
// //         let h = getRandomInt(3, 8);
// //         let roomPlaced = false;
// //         let attempts = 0;
        
// //         // Пытаемся разместить комнату
// //         while (!roomPlaced && attempts < 50) {
// //             attempts++;
// //             let x1 = getRandomInt(1, maze.width - w - 1); // отступ от краев
// //             let y1 = getRandomInt(1, maze.height - h - 1);
// //             let tempRect = [x1, y1, x1 + w, y1 + h];
            
// //             let intersects = false;
            
// //             // Проверяем пересечения с существующими комнатами
// //             for (const rect of rectMap) {
// //                 if (isIntersects(tempRect, rect)) {
// //                     intersects = true;
// //                     break;
// //                 }
// //             }
            
// //             if (!intersects) {
// //                 // Размещаем комнату в модели данных
// //                 for (let y = y1; y < y1 + h; y++) {
// //                     for (let x = x1; x < x1 + w; x++) {
// //                         maze.tiles[y][x] = false; // false - free space
// //                     }
// //                 }
                
// //                 rectMap.push(tempRect);
// //                 maze.rooms.push({
// //                     x: x1, y: y1, width: w, height: h
// //                 });
                
// //                 roomPlaced = true;
// //             }
// //         }
// //     }
// // }

