import { Entity } from './Entity';
import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricMap } from './PixiIsometricMap';
import { PixiUI } from './PixiUI';
import { Input, WHEEL_DIRECTION } from './Input';
import { Map } from './Map';
import { Camera } from './Camera';


export class Game {

    private camera: Camera;
    private cliffStep: number = 0;
    private levelCliff: number = 0;
    private levelHeight: number = 0;
    private elapsed: number = 0;
    private entities: Entity[] = [];
    private graphics: PixiGraphics;
    private input: Input;
    private isometric: PixiIsometricMap;
    private map: Map;
    private mouseReleased = true;
    private ui: PixiUI;

    constructor() {
        this.input = new Input();
        this.update = this.update.bind(this);
    }

    start() {
        this.map = new Map(32, 32);
        this.graphics = new PixiGraphics(this.update);
        this.camera = new Camera(this.graphics, this.input);
        this.isometric = new PixiIsometricMap(this.graphics, this.map);
        this.ui = new PixiUI(this.graphics, this.input);
        this.addEntity(this.map);
        this.addEntity(this.camera);
    }

    update(dt: number): void {
        this.input.update(dt);
        this.updateCursor();
        if (this.input.mouseLeftDown) {
            const pos = this.screenToTile(this.input.mouseX, this.input.mouseY);
            if (this.ui.tool === 'hill') {
                if (this.input.isKeyDown('Shift')) {
                    if (this.mouseReleased) {
                        const height = Math.min(
                            this.map.getVertexHeight(pos[0], pos[1]),
                            this.map.getVertexHeight(pos[0] + 1, pos[1]),
                            this.map.getVertexHeight(pos[0] + 1, pos[1] + 1),
                            this.map.getVertexHeight(pos[0], pos[1] + 1),
                        );
                        this.levelHeight = height;
                    }
                    this.map.levelTile(pos[0], pos[1], this.levelHeight);
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
            }
            else {
                if (this.mouseReleased) {
                    const height = Math.min(
                        this.map.getVertexHeight(pos[0], pos[1]),
                        this.map.getVertexHeight(pos[0] + 1, pos[1]),
                        this.map.getVertexHeight(pos[0] + 1, pos[1] + 1),
                        this.map.getVertexHeight(pos[0], pos[1] + 1),
                    );
                    if (this.input.isKeyDown('Control')) {
                        this.cliffStep = Math.floor(height) / 6 - 1;
                    }
                    else if (this.input.isKeyDown('Shift')) {
                        this.cliffStep = Math.floor(height) / 6;
                    }
                    else {
                        this.cliffStep = Math.floor(height) / 6 + 1;
                    }
                }
                this.map.setCliffHeight(pos[0], pos[1], this.cliffStep);
                this.isometric.update();
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
        const x = (screenX + this.camera.x) / this.camera.scale;
        const y = (screenY + this.camera.y) / this.camera.scale;
        const iso = this.screenToIso(x, y);
        return [Math.floor(iso[0]), Math.floor(iso[1])];
    }

    private toIso(x: number, y: number, width = 64): [number, number] {
        const isoX = (x * 0.5 - y * 0.5) * width;
        const isoY = (y * 0.25 + x * 0.25) * width;
        return [isoX, isoY];
    }

    private updateCursor() {
        const tile = this.screenToTile(this.input.mouseX, this.input.mouseY);
        const cursor = this.toIso(tile[0], tile[1]);
        const height = this.map.getTileHeight(tile[0], tile[1]);
        console.log(tile[0], tile[1], height);
        this.ui.mouseCursor.x = cursor[0] * this.camera.scale - this.camera.x;
        this.ui.mouseCursor.y = (cursor[1] - height * 16) * this.camera.scale - this.camera.y;
        this.ui.mouseCursor.scale.x = this.camera.scale;
        this.ui.mouseCursor.scale.y = this.camera.scale;
    }

}

export default Game;