import { Entity } from './Entity';
import { Container, Graphics } from './Graphics';
import { IsometricTileMap } from './IsometricTileMap';

export class Terrain extends Entity {
    	
    private _width: number;
    private _height: number;
    private _heightMap: number[];
    private _tileMap: IsometricTileMap;

    constructor(x: number = 0, y: number = 0, width: number, height: number, graphics: Graphics, container: Container) {
        super(0, 0, graphics);
        this._width = width + 1;
        this._height = height + 1;
        this._heightMap = [];
        this._tileMap = new IsometricTileMap(width, height, graphics, container);
        this._tileMap.initialize();
    }

    initialize() {
        this.generateHeightMap();
        this._tileMap.initialize();
    }

    generateHeightMap(t: number = 0): void {
        const rate = 8;
        const rate2 = 8;
        const tiles = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const z = Math.floor(Math.sin((x + t * 0.05) / rate) * rate) - Math.floor(Math.sin((y + t * 0.1) / rate2) * 4);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
            this._heightMap.push(z);
        }
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
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

        const FLAT = 66;
        const SLOPE_WS = 97;
        const SLOPE_NE = 98;
        const SLOPE_SE = 105;
        const SLOPE_NW = 90;

        const SLOPE_N = 20;
        const SLOPE_S = 35;
        const SLOPE_E = 28;
        const SLOPE_W = 27;

        if (!E && !S && !W) { return FLAT; }
        if (!W && S > 0 && E > 0) { return SLOPE_NW; }
        if (!E && W > 0 && S > 0) { return SLOPE_NE; }
        if (!W && S < 0 && E < 0) { return SLOPE_SE; }
        if (!E && W < 0 && S < 0) { return SLOPE_WS; }

        if (S > 0 && E > 0 && W > 0) { return SLOPE_N; }
        if (S < 0 && E < 0 && W < 0) { return SLOPE_S; }
        if (W > 0 && !S && !E) { return SLOPE_E; }
        if (E > 0 && !S && !W) { return SLOPE_W; }

        // return 0;
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

    // generateTiles(t: number = 0): { x: number, y: number, z: number, tile: number }[] {
    //     const tiles: { x: number, y: number, z: number, tile: number }[] = [];
    //     const rate = 8;
    //     const rate2 = 8;
    //     for (let y = 0; y < 100; ++y) {
    //         for (let x = 0; x < 100; ++x) {
    //             const z = Math.floor(Math.sin((x + t * 0.05) / rate) * rate) - Math.floor(Math.sin((y + t * 0.1) / rate2) * 4);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
    //             const tile = { x: x, y: y, z: z, tile: 66 };
    //             tiles.push(tile);
    //         }
    //     }
    //     return tiles;
    // }

}

export default Terrain;