import { Entity } from './Entity';
import { PixiGraphics } from './Graphics/PixiGraphics';
import { PixiUI } from './Graphics/PixiUI';
import { Input, WHEEL_DIRECTION } from './Input/Input';
import { HeightMap } from './HeightMap';
import { Camera } from './Camera';
import { Tree } from './Tree';
import { Man } from './Man';
import { Map, TILE_TYPE } from './Map';

export class Game {

    private entities: Entity[] = [];
    private graphics: PixiGraphics;
    private input: Input;
    private map: Map;
    private ui: PixiUI;
    private camera: Camera;
    private cliffStep: number = 0;
    private levelCliff: number = 0;
    private levelHeight: number = 0;
    private elapsed: number = 0;
    private mouseReleased = true;
    private zKeyReleased = true;

    constructor() {
        this.input = new Input();
        this.update = this.update.bind(this);
        this.initialize = this.initialize.bind(this);
    }

    start() {
        this.graphics = new PixiGraphics(this.initialize, this.update);
    }

    initialize() {
        this.map = new Map(this.graphics, new HeightMap(64, 64));
        this.ui = new PixiUI(this.graphics, this.input);
        this.camera = new Camera(this.graphics, this.input);
        this.addEntity(this.camera);
        const man = new Man(0, 0, 0, this.input, this.map);
        this.graphics.camera.addChild(man.sprite);
        this.addEntity(man);
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
        const height = this.map.heightMap.getTileHeight(tile[0], tile[1]);
        this.ui.mouseCursor.x = cursor[0] * this.camera.scale - this.camera.x;
        this.ui.mouseCursor.y = (cursor[1] - height * 16) * this.camera.scale - this.camera.y;
        this.ui.mouseCursor.scale.x = this.camera.scale;
        this.ui.mouseCursor.scale.y = this.camera.scale;
    }

    private handleInput() {
        if (this.input.isKeyDown('z')) {
            if (this.input.isKeyDown('Control') && this.zKeyReleased) {
                this.map.heightMap.undo();
                this.map.updateGraphics();
            }
            this.zKeyReleased = false;
        }
        else if (this.input.isKeyDown('Z')) {
            if (this.input.isKeyDown('Control') && this.zKeyReleased) {
                this.map.heightMap.redo();
                this.map.updateGraphics();
            }
            this.zKeyReleased = false;
        }
        else {
            this.zKeyReleased = true;
        }
        if (this.input.mouseLeftDown) {
            const pos = this.screenToTile(this.input.mouseX, this.input.mouseY);
            if (this.ui.tool === 'hill') {
                if (this.input.isKeyDown('Shift')) {
                    if (this.mouseReleased) {
                        const height = Math.min(
                            this.map.heightMap.getVertexHeight(pos[0], pos[1]),
                            this.map.heightMap.getVertexHeight(pos[0] + 1, pos[1]),
                            this.map.heightMap.getVertexHeight(pos[0] + 1, pos[1] + 1),
                            this.map.heightMap.getVertexHeight(pos[0], pos[1] + 1),
                        );
                        this.levelHeight = height;
                    }
                    this.map.levelTile(pos[0], pos[1], this.levelHeight);
                    this.map.updateGraphics();
                }
                else {
                    if (this.mouseReleased) {
                        if (this.input.isKeyDown('Control')) {
                            this.map.lowerTile(pos[0], pos[1]);
                        }
                        else {
                            this.map.raiseTile(pos[0], pos[1]);
                        }
                        this.map.updateGraphics();
                    }
                }
            }
            else if (this.ui.tool === 'cliff') {
                if (this.mouseReleased) {
                    const height = Math.min(
                        this.map.heightMap.getVertexHeight(pos[0], pos[1]),
                        this.map.heightMap.getVertexHeight(pos[0] + 1, pos[1]),
                        this.map.heightMap.getVertexHeight(pos[0] + 1, pos[1] + 1),
                        this.map.heightMap.getVertexHeight(pos[0], pos[1] + 1),
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
                this.map.heightMap.setCliffHeight(pos[0], pos[1], this.cliffStep);
                this.map.updateGraphics();
            }
            else if (this.ui.tool === 'tree') {
                if (this.input.isKeyDown('Control')) {
                    this.map.removeTree(pos[0], pos[1]);
                }
                else {
                    this.map.addTree(pos[0], pos[1]);
                }
            }
            else if (this.ui.tool === 'dirt') {
                if (this.input.isKeyDown('Control')) {
                    this.map.setVertexType(pos[0], pos[1], TILE_TYPE.GRASS);
                }
                else {
                    this.map.setVertexType(pos[0], pos[1], TILE_TYPE.SAND);
                }
            }
            else if (this.ui.tool === 'water') {
                if (this.input.isKeyDown('Control')) {
                    this.map.paintTile(pos[0], pos[1], TILE_TYPE.GRASS);
                }
                else {
                    this.map.paintTile(pos[0], pos[1], TILE_TYPE.WATER);
                }
            }
            this.mouseReleased = false;
        }
        else {
            this.mouseReleased = true;
        }
    }

}

export default Game;