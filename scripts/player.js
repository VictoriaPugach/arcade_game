class Hero extends EntityPlacer {
    constructor(maze) {
        super(maze);
        this.x = 0;
        this.y = 0;
        this.hasSword = false;
        this.attack = 2;
        this.healthMax = 20;
        this.health = 20;
    }


    placeItems() {
    }

    // placeHero(count) {
    //     for (let i = 0; i < count; i++) {
    //         this.placeItem('tilePwosw');
    //     }
    // }

    // placeItem(itemType) {
    //     let attempts = 0;
    //     while (attempts < 100) {
    //         const x = getRandomInt(0, this.maze.width - 1);
    //         const y = getRandomInt(0, this.maze.height - 1);
        
    //         if (this.maze.tiles[y][x] === 0) {
    //             this.maze.tiles[y][x] = itemType; 
    //             return;
    //         }
    //         attempts++;
    //     }
    // }

    async findStartPosition() {
        let placed = false;
        while (!placed) {
            placed = this.placeSingleEntity('tilePwosw');
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    onEntityPlaced(x, y, entityType, extraData) {
        if (entityType === 'tilePwosw') {
            this.x = x;
            this.y = y;
        }
    }

    isMazeReady() {
        return this.maze && 
               this.maze.tiles && 
               this.maze.tiles.length > 0 &&
               this.maze.tiles[0].length > 0;
    }

    move(dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;

        if (newX >= 0 && newX < this.maze.width && 
            newY >= 0 && newY < this.maze.height &&
            this.maze.tiles[newY][newX] !== 1) {

            this.checkForSwordPickup(newX, newY);
            this.checkForHealthPotionPickup(newX, newY);
            
            this.maze.tiles[this.y][this.x] = 0;
            
            this.x = newX;
            this.y = newY;
            this.maze.tiles[this.y][this.x] = this.hasSword ? 'tileP' : 'tilePwosw';            
            return true;
        }
        
        if ((newX < 0 || newX >= this.maze.width || 
             newY < 0 || newY >= this.maze.height) && 
            this.isInPassage()) {
            return this.teleportToOppositeSide(dx, dy);
        }
        
        return false;
    }

    isInPassage() {
        return this.maze.tiles[this.y][this.x] === 0 || 
               this.maze.tiles[this.y][this.x] === 'tilePwosw' ||
               this.maze.tiles[this.y][this.x] === 'tileP';
    }

    teleportToOppositeSide(dx, dy) {
        let newX = this.x;
        let newY = this.y;
        
        if (dx !== 0) { 
            newX = dx > 0 ? 0 : this.maze.width - 1;
        } else if (dy !== 0) {
            newY = dy > 0 ? 0 : this.maze.height - 1;
        }
        
        if (this.maze.tiles[newY][newX] !== 1) {
            this.maze.tiles[this.y][this.x] = 0;
            
            this.x = newX;
            this.y = newY;
            this.maze.tiles[this.y][this.x] = this.hasSword ? 'tileP' : 'tilePwosw';
            
            return true;
        }
        return false;
    }

    findPassageEnd(startX, startY, dx, dy) {
        let x = startX;
        let y = startY;
        
        while (true) {
            const nextX = x - dx;
            const nextY = y - dy;
            
            if (nextX < 0 || nextX >= this.maze.width || 
                nextY < 0 || nextY >= this.maze.height) {
                break;
            }
            
            if (this.maze.tiles[nextY][nextX] === 1) {
                break;
            }
            
            x = nextX;
            y = nextY;
        }
        return dx !== 0 ? x : y;
    }

    checkForSwordPickup(x, y) {
        if (this.maze.tiles[y][x] === 'tileSW') {
            // console.log('Меч подобран! Сила атаки увеличена.');
            this.pickUpSword();
            this.maze.tiles[y][x] = 0;

            this.addToInventory('tileSW');
            return true;
        }
    }

    addToInventory(itemType) {
        const inventory = document.querySelector('.inventory');
        if (inventory) {
            const item = document.createElement('div');
            item.className = itemType;
            inventory.appendChild(item);
            // console.log('Предмет добавлен в инвентарь:', itemType);
        }
    }

    pickUpSword() {
        this.hasSword = true;
        this.attackPower = 6; 
        
        if (this.maze.tiles[this.y][this.x] === 'tilePwosw') {
            this.maze.tiles[this.y][this.x] = 'tileP';
        }
        
    }

    checkForHealthPotionPickup(x, y) {
        if (this.maze.tiles[y][x] === 'tileHP') {
            // console.log('Подобрано зелье здоровья!');
            this.heal(4); 
            this.maze.tiles[y][x] = 0; 
            return true;
        }
        return false;
    }
    
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.healthMax, this.health + amount);
        const healed = this.health - oldHealth;
        // console.log(`Восстановлено ${healed} здоровья. Теперь: ${this.health}/${this.healthMax}`);
        return healed;
    }

    attack() {
        // console.log('Герой атакует! Сила:', this.attack);
        let attacked = false;
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                
                const x = this.x + dx;
                const y = this.y + dy;
                
                if (x >= 0 && x < this.maze.width && 
                    y >= 0 && y < this.maze.height &&
                    this.maze.tiles[y][x] === 'tileE') {
                    
                    // console.log(`Попал по врагу на ${x},${y}`);
                    attacked = true;
                }
            }
        }
        return attacked;
    }
    
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        // console.log(`Герой получил ${damage} урона. Здоровье: ${this.health}`);
        return this.health > 0;
    }
    
    getHealthHTML() {
        const percent = (this.health / this.healthMax) * 100;
        return `<div class="health" style="width: ${percent}%"></div>`;
    }

    moveLeft() { return this.move(-1, 0); }
    moveUp() { return this.move(0, -1); }
    moveDown() { return this.move(0, 1); }
    moveRight() { return this.move(1, 0); }
}