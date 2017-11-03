import { Entity } from './Entity';
import { Container, Graphics } from './Graphics';
import { PixiGraphics } from './PixiGraphics';
import { Input, WHEEL_DIRECTION } from './Input';
import { IsometricTileMap, Tile } from './IsometricTileMap';
import { Terrain } from './Terrain';

import tiles from './tiles.png';
import tilesJSON from './tiles.json';

export class Game {

    private entities: Entity[] = [];
    private graphics: Graphics;
    private camera: Container;
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
                this.camera.scale *= 1.2;
            }
            else {
                this.camera.scale /= 1.2;
            }
        })
    }

    start() {
        this.graphics.initialize(this.update);
        this.graphics.load(tilesJSON, () => {
            this.camera = this.graphics.createContainer();
            this.camera.scale = 0.05;
            this.graphics.add(this.camera);
            
            // const tilemap = new IsometricTileMap(1000, 1000, this.graphics, this.camera);
            this.terrain = new Terrain(0, 0, 50, 50, this.graphics, this.camera);
            this.terrain.initialize();
            this.addEntity(this.terrain);
        });
    }

    update(dt: number): void {

        if (this.input.mouseDown) {
            if (!this.initialePos){
                this.initialePos = [this.input.mouseX - this.camera.x, this.input.mouseY - this.camera.y];
            }
            this.camera.x = this.input.mouseX - this.initialePos[0];
            this.camera.y = this.input.mouseY - this.initialePos[1];
        }
        else {
            this.initialePos = null;
        }

        this.elapsed += dt;
        // if (this.tilemap) {
        //     this.tilemap.setTiles(this.generateTiles(this.elapsed));
        // }

        this.entities.forEach((entity) => entity.update(dt));
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        this.entities.push(ent);
    }

}

export default Game;