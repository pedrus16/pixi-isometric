import { Entity } from './Entity';
import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricMap } from './PixiIsometricMap';
import { Input, WHEEL_DIRECTION } from './Input';
import { Map } from './Map';

export class Game {

    private entities: Entity[] = [];
    private graphics: PixiGraphics;
    private input: Input;

    constructor() {
        this.input = new Input();
        this.update = this.update.bind(this);
    }

    start() {
        const map = new Map(200, 200);
        this.graphics = new PixiGraphics(this.update);
        const isometric = new PixiIsometricMap(this.graphics, map);
        this.addEntity(map);
    }

    update(dt: number): void {
        this.entities.forEach((entity) => entity.update(dt));
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        this.entities.push(ent);
    }

}

export default Game;