import { Entity } from './Entity';
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

    constructor(x: number = 0, y: number = 0, width: number, height: number, graphics: Graphics, container: Container) {
        super(0, 0, graphics);
        this._width = width + 1;
        this._height = height + 1;
        this._heightMap = [];
        this._elapsed = 0;
        this._tileMap = new IsometricTileMap(width, height, graphics, container);
        this._tileMap.initialize();
    }

    initialize() {
        this._tileMap.initialize();
        // this.generateHeightMap();
    }

    update(dt: number) {
        this._elapsed += dt;
        this.generateHeightMap(this._elapsed * 1);
    }

    generateHeightMap(t: number = 0): void {
        const rate = 2;
        const rate2 = 2;
        
        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const z = Math.floor(Math.sin((x + t * 0.05) / rate) * rate) - Math.floor(Math.sin((y + t * 0.1) / rate2) * rate2);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
            this._heightMap.push(z);
        }
        this.updateTiles();
    }

    updateTiles() {
        const tiles = [];
        const width = this._width - 1;
        const height = this._height - 1;
        for (let i = 0; i < width * height; ++i) {
            const x = i % width;
            const y = Math.floor(i / width);
            tiles.push({x: x, y: y, z: this.getTileHeightAt(x, y), tile: this.getTileAt(x, y) });
        }
        this._tileMap.setTiles(tiles);
    }

    get heightMap(): number[] {
        return this._heightMap;
    }

    getTileAt(x: number, y: number): number {
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

        const FLAT = 0;
        const SLOPE_WS = 8;
        const SLOPE_NW = 9;
        const SLOPE_NE = 10;
        const SLOPE_SE = 11;

        const SLOPE_S = 20;
        const SLOPE_W = 21;
        const SLOPE_N = 22;
        const SLOPE_E = 23;

        // console.log(N, E, S, W);

        if (!W && S > 0 && E > 0) { return SLOPE_NW; }
        if (!E && W > 0 && S > 0) { return SLOPE_NE; }
        if (!W && S < 0 && E < 0) { return SLOPE_SE; }
        if (!E && W < 0 && S < 0) { return SLOPE_WS; }

        if (S > 0 && E > 0 && W > 0) { return SLOPE_N; }
        if (S < 0 && E < 0 && W < 0) { return SLOPE_S; }
        if (W > 0 && !S && E < 0) { return SLOPE_E; }
        if (E > 0 && !S && W < 0) { return SLOPE_W; }

        return FLAT;
    }

    getTileHeightAt(x: number, y: number): number {
        const N: number = this.getHeightAt(x, y);
        const E: number = this.getHeightAt(x + 1, y);
        const S: number = this.getHeightAt(x + 1, y + 1);
        const W: number = this.getHeightAt(x, y + 1);

        return Math.min(N, S, E, W);
    }

    getHeightAt(x: number, y: number): number {
        return this._heightMap[y * this._width + x];
    }

}

export default Terrain;