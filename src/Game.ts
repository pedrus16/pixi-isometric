import { Entity } from './Entity';
import { Container, Graphics } from './Graphics';
import { PixiGraphics } from './PixiGraphics';
import { Input, WHEEL_DIRECTION } from './Input';
import { IsometricTileMap, Tile } from './IsometricTileMap';
import { Terrain } from './Terrain';
import { Camera } from './Camera';

import tilesJSON from './tiles_2.json';

export class Game {

    private entities: Entity[] = [];
    private graphics: Graphics;
    private camera: Camera;
    private input: Input;

    private initialePos = [0, 0];
    private terrain: Terrain;
    private elapsed: number = 0;

    constructor() {
        this.graphics = new PixiGraphics();
        this.input = new Input();
        this.update = this.update.bind(this);
        this.input.onMouseWheel((direction: WHEEL_DIRECTION) => {
            if (direction === WHEEL_DIRECTION.UP) {
                this.camera.zoom *= 1.2;
            }
            else {
                this.camera.zoom /= 1.2;
            }
        })
    }

    start() {
        this.graphics.initialize(this.update);
        this.graphics.load(tilesJSON, () => {
            this.camera = new Camera(0, 0, this.graphics.screenWidth, this.graphics.screenHeight, this.graphics);
            // this.camera.scale = 0.5;
            this.graphics.add(this.camera.container);
            
            this.terrain = new Terrain(0, 0, 500, 500, this.graphics, this.camera);
            this.terrain.initialize();
            this.addEntity(this.terrain);
        });
    }

    update(dt: number): void {

        if (this.input.mouseDown) {
            if (!this.initialePos){
                this.initialePos = [this.input.mouseX + this.camera.x, this.input.mouseY + this.camera.y];
            }
            this.camera.x = this.initialePos[0] - this.input.mouseX;
            this.camera.y = this.initialePos[1] - this.input.mouseY;
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