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
    private mouseReleased = true;

    private initialePos = [0, 0];
    private elapsed: number = 0;
    private map: Map;
    private isometric: PixiIsometricMap;
    private cliffStep: number = 0;

    constructor() {
        this.input = new Input();
        this.update = this.update.bind(this);
        this.input.onMouseWheel((direction: WHEEL_DIRECTION) => {
            if (direction === WHEEL_DIRECTION.UP) {
                this.graphics.camera.scale.x *= 2;
                this.graphics.camera.scale.y *= 2;
                this.camera.x *= 2
                this.camera.y *= 2
            }
            else {
                this.graphics.camera.scale.x *= 0.5;
                this.graphics.camera.scale.y *= 0.5;
                this.camera.x *= 0.5;
                this.camera.y *= 0.5;
            }
        });
    }

    start() {
        this.map = new Map(32, 32);
        this.graphics = new PixiGraphics(this.update);
        // this.camera.x = this.graphics.app.screen.width * -0.5;
        this.isometric = new PixiIsometricMap(this.graphics, this.map);
        this.addEntity(this.map);
    }

    update(dt: number): void {
        if (this.input.mouseRightDown) {
            if (!this.initialePos){
                this.initialePos = [
                    this.input.mouseX + this.camera.x, 
                    this.input.mouseY + this.camera.y
                ];
            }
            this.camera.x = this.initialePos[0] - this.input.mouseX;
            this.camera.y = this.initialePos[1] - this.input.mouseY;

            // console.log(screenToTile(this.input.mouseX - this.camera.x, this.input.mouseY - this.camera.y));
            
            // this.graphics.camera.pivot.x = this.graphics.app.screen;
            // + this.graphics.app.screen.width * 0.5
        }
        else {
            this.initialePos = null;
        }
        this.graphics.camera.x = -this.camera.x + this.graphics.app.screen.width * 0.5;
        this.graphics.camera.y = -this.camera.y + this.graphics.app.screen.height * 0.5;
        if (this.input.mouseLeftDown) {
            const pos = this.screenToTile(this.input.mouseX, this.input.mouseY);
            if (this.input.isKeyDown('Shift')) {
                if (this.mouseReleased) {
                    const height = this.map.getHeightAt(pos[0] + 0.5, pos[1] + 0.5);
                    this.cliffStep = Math.floor(height) / 6 + 1;
                }
                this.map.setCliffHeight(pos[0], pos[1], this.cliffStep);
                this.isometric.update();
            }
            else {
                if (this.mouseReleased) {
                    if (this.input.isKeyDown('Control')) {
                        this.map.lowerTile(pos[0], pos[1]);
                    }
                    else {
                        this.map.raiseTile(pos[0], pos[1]);
                    }
                    this.isometric.update();
                }
            }
            this.mouseReleased = false;
        }
        else {
            this.mouseReleased = true;
        }
        this.entities.forEach((entity) => entity.update(dt));
        // this.isometric.update();
    }

    addEntity(ent: Entity) {
        ent.id = this.entities.length;
        this.entities.push(ent);
    }

    private screenToIso(x: number, y: number): [number, number] {
        const TILE_WIDTH = 64;
        const isoX = (x / (TILE_WIDTH * 0.5) + y / (TILE_WIDTH * 0.25)) * 0.5;
        const isoY = (y / (TILE_WIDTH * 0.25) - x / (TILE_WIDTH * 0.5)) * 0.5;
        return [isoX, isoY];
    }

    private screenToTile(screenX: number, screenY: number): [number, number] {
        const x = (screenX + this.camera.x - this.graphics.app.screen.width * 0.5) / this.graphics.camera.scale.x;
        const y = (screenY + this.camera.y - this.graphics.app.screen.height * 0.5) / this.graphics.camera.scale.y;
        const iso = this.screenToIso(x, y);
        return [Math.floor(iso[0]), Math.floor(iso[1])];
    }

}

export default Game;