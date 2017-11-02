import { Entity } from './Entity';
import { Camera, Graphics } from './Graphics';
import { PixiGraphics } from './PixiGraphics';
import { IsometricTerrain } from './IsometricTerrain';

import tiles from './tiles.png';
import tilesJSON from './tiles.json';

export class Game {

    private entities: Entity[] = [];
    private graphics: Graphics;
    private camera: Camera;

    private mouse = { down: false, x: 0, y: 0, zoom: 1 };

    private initialePos = [0, 0];

    constructor() {
        this.graphics = new PixiGraphics();
        this.update = this.update.bind(this);

        window.addEventListener('mousedown', (event) => {
            this.mouse.down = true;
        });

        window.addEventListener('mouseup', (event) => {
            this.mouse.down = false;
        });

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });

        window.addEventListener('mousewheel', (event) => {
            if (event.deltaY > 0) {
                this.mouse.zoom /= 1.2;
            }
            else if (event.deltaY < 0) {
                this.mouse.zoom *= 1.2;
            }
            if (this.camera) {
                this.camera.scale = this.mouse.zoom;
            }
        });
    }

    start() {
        this.graphics.initialize(this.update);
        this.graphics.load(tilesJSON, () => {
            this.camera = this.graphics.createCamera();
            this.graphics.addCamera(this.camera);
            this.addEntity(new IsometricTerrain(10, 10));
        });
    }

    update(dt: number): void {

        if (this.mouse.down) {
            if (!this.initialePos){
                this.initialePos = [this.mouse.x - this.camera.x, this.mouse.y - this.camera.y];
            }
            this.camera.x = this.mouse.x - this.initialePos[0];
            this.camera.y = this.mouse.y - this.initialePos[1];
        }
        else {
            this.initialePos = null;
        }
        this.entities.forEach((entity) => entity.update(dt));
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        ent.initialize(this.graphics);
        this.camera.addSprites(ent.sprites);
        this.entities.push(ent);
    }

}

export default Game;