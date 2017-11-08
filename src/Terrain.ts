import { Entity } from './Entity';
import { Camera } from './Camera';
import { Input } from './Input';
import { Container, Graphics } from './Graphics';
import { IsometricTileMap } from './IsometricTileMap';

const SLOPES = {

};

export class Terrain extends Entity {
    	
    private _width: number;
    private _height: number;
    private _heightMap: number[];
    private _tileMap: IsometricTileMap;
    private _elapsed: number;
    private _input: Input;
    private _camera: Camera;
    private _cornerHitBoxes: Container[];
    private _tileHitBoxes: Container[];

    constructor(x: number = 0, y: number = 0, width: number, height: number, graphics: Graphics, camera: Camera, input: Input) {
        super(0, 0, graphics);
        this._width = width + 1;
        this._height = height + 1;
        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) { this._heightMap.push(0); }
        this._elapsed = 0;
        this._camera = camera;
        this._tileMap = new IsometricTileMap(width, height, graphics, this._camera);
        this._input = input;
        this._cornerHitBoxes = [];
        this._tileHitBoxes = [];
    }

    get heightMap(): number[] {
        return this._heightMap;
    }

    initialize() {
        this._tileMap.initialize();
        this.updateTiles();
        this.initializeHitBoxes();
    }

    update(dt: number) {
        this._elapsed += dt;
        this._tileMap.update(dt);
    }

    setHeight(x: number, y: number, height: number) {
        this._heightMap[y * this._width + x] = height;
    }

    private initializeHitBoxes() {
        for (let i = 0; i < this._width * this._height; ++i) { 
            this._heightMap.push(0); 

            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const TILE_WIDTH = 64;
            const TILE_HEIGHT = 16;
            const isoX = x * TILE_WIDTH * 0.5 - y * TILE_WIDTH * 0.5;
            const isoY = y * TILE_WIDTH * 0.25 + x * TILE_WIDTH * 0.25 - this.getHeightAt(x, y) * TILE_HEIGHT;

            const corner = this.graphics.createCircle(isoX + TILE_WIDTH * 0.5, isoY - TILE_WIDTH * 0.5, 8, 8);
            corner.onClick(() => {
                if (this._input.isKeyDown('Control')) {
                    this.decrementHeight(x, y);
                }
                else {
                    this.incrementHeight(x, y);
                }
            });
            this._cornerHitBoxes.push(corner);
            // this._camera.add(corner);

            const center = this.graphics.createCircle(isoX + TILE_WIDTH * 0.5, isoY - TILE_WIDTH * 0.25, 16, 8);
            center.onClick(() => {
                if (this._input.isKeyDown('Control')) {
                    this.decrementHeightRadius(x, y, 2);
                }
                else {
                    this.incrementHeightRadius(x, y, 2);
                }
            });
            this._tileHitBoxes.push(center);
            this._camera.add(center);
        }
    }

    private updateHitBoxes() {
        for (let i = 0; i < this._width * this._height; ++i) { 
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const TILE_WIDTH = 64;
            const TILE_HEIGHT = 16;
            const corner = this._cornerHitBoxes[i];
            if (corner) {
                corner.y = -this.getHeightAt(x, y) * TILE_HEIGHT;
            }

            const center = this._tileHitBoxes[i];
            if (center) {
                center.y = -this.getHeightAt(x, y) * TILE_HEIGHT;
            }
        }
    }

    private decrementHeight(x: number, y: number, update = true) {
        const center = this.getHeightAt(x, y);
        const NW = this.getHeightAt(x - 1, y);
        const NE = this.getHeightAt(x, y - 1);
        const SW = this.getHeightAt(x, y + 1);
        const SE = this.getHeightAt(x + 1, y);

        this.setHeight(x, y, center - 1);
        if (center - NW < 0) {
            this.decrementHeight(x - 1, y, false);
        }
        if (center - NE < 0) {
            this.decrementHeight(x, y - 1, false);
        }
        if (center - SW < 0) {
            this.decrementHeight(x, y + 1, false);
        }
        if (center - SE < 0) {
            this.decrementHeight(x + 1, y, false);
        }
        if (update) {
            this.updateTiles();
        }
    }

    private incrementHeight(x: number, y: number, update = true) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) { return; }

        const center = this.getHeightAt(x, y);
        const NW = this.getHeightAt(x - 1, y);
        const NE = this.getHeightAt(x, y - 1);
        const SW = this.getHeightAt(x, y + 1);
        const SE = this.getHeightAt(x + 1, y);

        this.setHeight(x, y, center + 1);
        if (center - NW > 0) {
            this.incrementHeight(x - 1, y, false);
        }
        if (center - NE > 0) {
            this.incrementHeight(x, y - 1, false);
        }
        if (center - SW > 0) {
            this.incrementHeight(x, y + 1, false);
        }
        if (center - SE > 0) {
            this.incrementHeight(x + 1, y, false);
        }
        if (update) {
            this.updateTiles();
        }
    }

    private incrementHeightRadius(centerX: number, centerY: number, radius: number) {
        const startX = Math.floor(centerX + 1 - radius * 0.5);
        const startY = Math.floor(centerY + 1 - radius * 0.5);
        for (let x = 0; x < radius; ++x) {
            for (let y = 0; y < radius; ++y) {
                this.incrementHeight(startX + x,startY + y, false);
            }
        }
        this.updateTiles();
    }

    private decrementHeightRadius(x: number, y: number, radius: number) {
        this.decrementHeight(x, y, false);
        this.decrementHeight(x + 1, y, false);
        this.decrementHeight(x, y + 1, false);
        this.decrementHeight(x + 1, y + 1, false);
        this.updateTiles();
    }

    private generateHeightMap(t: number = 0): void {
        const rate = 8;
        const rate2 = 8;
        
        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const z = Math.floor(Math.sin((x + t * 0.5) / rate) * rate) - Math.floor(Math.sin((y + t) / rate2) * rate2);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
            this._heightMap.push(z);
        }
        this.updateTiles();
    }

    private updateTiles() {
        const tiles = [];
        const width = this._width - 1;
        const height = this._height - 1;
        for (let i = 0; i < width * height; ++i) {
            const x = i % width;
            const y = Math.floor(i / width);
            const z = this.getTileHeightAt(x, y);
            tiles.push({x: x, y: y, z: z, tile: this.getTileAt(x, y) });
        }
        this._tileMap.setTiles(tiles);
        this.updateHitBoxes();

    }


    private getTileAt(x: number, y: number): number {
        if (x >= this._width - 1 || y >= this._height - 1) { return 0; }

        const tileHeight = this.getHeightAt(x, y);
        const N: number = this.getHeightAt(x, y);
        const E: number = this.getHeightAt(x + 1, y) - tileHeight;
        const S: number = this.getHeightAt(x + 1, y + 1) - tileHeight;
        const W: number = this.getHeightAt(x, y + 1) - tileHeight;

        // const FLAT = 66;
        // const SLOPE_WS = 97; // 97 - 21
        // const SLOPE_NE = 98; // 98 - 9
        // const SLOPE_SE = 105; // 105 - 14
        // const SLOPE_NW = 90; // 90 - 15

        // const SLOPE_N = 20;
        // const SLOPE_S = 35;
        // const SLOPE_E = 28;
        // const SLOPE_W = 27;

        // TODO: Redo all this mess

        const FLAT = 0;
        const SLOPE_WS = 8;
        const SLOPE_NW = 9;
        const SLOPE_NE = 10;
        const SLOPE_SE = 11;

        const SLOPE_STEEP_S = 20;
        const SLOPE_STEEP_W = 21;
        const SLOPE_STEEP_N = 22;
        const SLOPE_STEEP_E = 23;

        const SLOPE_N = 4;
        const SLOPE_E = 5;
        const SLOPE_S = 6;
        const SLOPE_W = 7;

        const PLATEAU_E = 16;
        const PLATEAU_S = 17;
        const PLATEAU_W = 18;
        const PLATEAU_N = 19;

        const V_NS = 12;
        const V_EW = 13;

        if (!W && S === 1 && E === 1) { return SLOPE_NW; }
        if (!E && W === 1 && S === 1) { return SLOPE_NE; }
        if (!W && S === -1 && E === -1) { return SLOPE_SE; }
        if (!E && W === -1 && S === -1) { return SLOPE_WS; }

        if (S === -1 && E === -1 && W === -1) { return SLOPE_N; }
        if (S === 1 && !E && !W) { return SLOPE_S; }
        if (!W && !S && E === 1) { return SLOPE_E; }
        if (!E && !S && W === 1) { return SLOPE_W; }

        if (S === 2 && E === 1 && W === 1) { return SLOPE_STEEP_N; }
        if (S === -2 && E === -1 && W === -1) { return SLOPE_STEEP_S; }
        if (W === 1 && !S && E === -1) { return SLOPE_STEEP_E; }
        if (E === 1 && !S && W === -1) { return SLOPE_STEEP_W; }

        if (!E && !S && W === -1) { return PLATEAU_E; }
        if (S === 1 && E === 1 && W === 1) { return PLATEAU_S; }
        if (!W && !S && E === -1) { return PLATEAU_W; }
        if (!E && !W && S === -1) { return PLATEAU_N; }

        if (!S && E === -1 && W === -1) { return V_NS; }
        if (!S && E === 1 && W === 1) { return V_EW; }

        return FLAT;
    }

    private getTileHeightAt(x: number, y: number): number {
        const N: number = this.getHeightAt(x, y);
        const E: number = this.getHeightAt(x + 1, y);
        const S: number = this.getHeightAt(x + 1, y + 1);
        const W: number = this.getHeightAt(x, y + 1);

        return Math.min(N, S, E, W);
    }

    private getHeightAt(x: number, y: number): number {
        return this._heightMap[y * this._width + x];
    }

}

export default Terrain;