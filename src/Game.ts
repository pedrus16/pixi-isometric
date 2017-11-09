import { Entity } from './Entity';
import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricMap } from './PixiIsometricMap';
import { Input, WHEEL_DIRECTION } from './Input';
import { Map } from './Map';

export class Game {

    private entities: Entity[] = [];
    private graphics: PixiGraphics;
    private input: Input;
    private camera = { x: 0, y: 0 };

    private initialePos = [0, 0];
    private elapsed: number = 0;

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
        if (this.input.mouseDown) {
            if (!this.initialePos){
                this.initialePos = [this.input.mouseX - this.camera.x, this.input.mouseY - this.camera.y];
            }
            this.camera.x = this.input.mouseX - this.initialePos[0];
            this.camera.y = this.input.mouseY - this.initialePos[1];
            this.graphics.camera.x = this.camera.x;
            this.graphics.camera.y = this.camera.y;
        }
        else {
            this.initialePos = null;
        }
        this.entities.forEach((entity) => entity.update(dt));
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        this.entities.push(ent);
    }

}

export default Game;