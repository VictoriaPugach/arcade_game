class Items extends EntityPlacer {
    constructor(maze) {
        super(maze);
    }

    placeItems() {
        this.placeSwords(2);
        this.placePotions(10);
    }

    placeSwords(count) {
        this.placeEntity('tileSW', count);
    }

    placePotions(count) {
        this.placeEntity('tileHP', count);
    }

    onEntityPlaced(x, y, entityType, extraData) {
    }
}