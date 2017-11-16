import { Entity } from './Entity';
import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricTileMap } from './PixiIsometricTileMap';
import { PixiUI } from './PixiUI';
import { Input, WHEEL_DIRECTION } from './Input';
import { Map } from './Map';
import { Camera } from './Camera';
import { Tree } from './Tree';

export class Game {

    private entities: Entity[] = [];
    private graphics: PixiGraphics;
    private input: Input;
    private tileMap: PixiIsometricTileMap;
    private map: Map;
    private ui: PixiUI;
    private camera: Camera;
    private cliffStep: number = 0;
    private levelCliff: number = 0;
    private levelHeight: number = 0;
    private elapsed: number = 0;
    private mouseReleased = true;
    private tree: Tree;

    constructor() {
        this.input = new Input();
        this.update = this.update.bind(this);
        this.initialize = this.initialize.bind(this);
    }

    start() {
        this.graphics = new PixiGraphics(this.initialize, this.update);
    }

    initialize() {
        this.map = new Map(32, 32);
        this.addEntity(this.map);

        this.camera = new Camera(this.graphics, this.input);
        this.addEntity(this.camera);

        this.tileMap = new PixiIsometricTileMap(this.graphics, this.map);
        this.ui = new PixiUI(this.graphics, this.input);

        this.tree = new Tree(4.5, 4.5, this.map.getHeightAt(4.5, 4.5));
        this.graphics.camera.addChild(this.tree.sprite);
        this.addEntity(this.tree);
    }

    update(dt: number): void {
        this.input.update(dt);
        this.updateCursor();
        this.handleInput();
        this.entities.forEach((entity) => entity.update(dt));
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
        this.ui.mouseCursor.x = cursor[0] * this.camera.scale - this.camera.x;
        this.ui.mouseCursor.y = (cursor[1] - height * 16) * this.camera.scale - this.camera.y;
        this.ui.mouseCursor.scale.x = this.camera.scale;
        this.ui.mouseCursor.scale.y = this.camera.scale;
    }

    private handleInput() {
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
                    this.updateVisuals();
                }
                else {
                    if (this.mouseReleased) {
                        if (this.input.isKeyDown('Control')) {
                            this.map.lowerTile(pos[0], pos[1]);
                        }
                        else {
                            this.map.raiseTile(pos[0], pos[1]);
                        }
                        this.updateVisuals();
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
                this.updateVisuals();
            }
            this.mouseReleased = false;
        }
        else {
            this.mouseReleased = true;
        }
    }

    updateVisuals() {
        this.tileMap.update();
        this.tree.z = this.map.getHeightAt(4.5, 4.5);
    }

}

export default Game;