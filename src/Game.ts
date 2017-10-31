import { Entity } from './Entity';
import { Graphics } from './Graphics';
import { PixiGraphics } from './PixiGraphics';
import { IsometricTerrain } from './IsometricTerrain';

import tiles from './tiles.png';
import tilesJSON from './tiles.json';

export class Game {

    private entities: Entity[] = [];
    private graphics: Graphics;

    constructor() {
        this.graphics = new PixiGraphics();
        this.update = this.update.bind(this);
    }

    start() {
        this.graphics.initialize(this.update);
        this.graphics.load(tilesJSON, () => {
            this.addEntity(new IsometricTerrain(0, 0, 10, 10, []));
        });
    }

    update(dt: number): void {
        this.entities.forEach((entity) => entity.update(dt));
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        ent.initialize(this.graphics);
        this.entities.push(ent);
    }

}

export default Game;