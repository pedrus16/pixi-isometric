import { Entity } from './Entity';


export const CLIFF_HEIGHT = 3;

export enum TILE_TYPE {
    DIRT,
    GRASS,
    WATER,
};

export class Map extends Entity {

    private _heightMap: number[];
    private _tileMap: TILE_TYPE[];
    private _width: number;
    private _height: number;
    private _elapsed: number;

    constructor(width: number, height: number) {
        super(0, 0);
        this._elapsed = 0;
        this._width = width + 1;
        this._height = height + 1;

        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) { this._heightMap.push(0); }
        this._tileMap = [];
        for (let i = 0; i < width * height; ++i) { this._tileMap.push(TILE_TYPE.GRASS); }
    }

    get width(): number { return this._width - 1; }
    get height(): number { return this._height - 1; }
    get heightMap(): number[] { return this._heightMap; }

    update(dt: number) {
        this._elapsed += dt;
        // this.generateHeightMap(this._elapsed);
    }

    getHeightAt(x: number, y: number): number {
        const minX = Math.floor(x);
        const maxX = Math.ceil(x);
        const minY = Math.floor(y);
        const maxY = Math.ceil(y);
        const top_left = this.getVertexHeight(Math.floor(x), Math.floor(y));
        const top_right = this.getVertexHeight(Math.ceil(x), Math.floor(y));
        const bottom_left = this.getVertexHeight(Math.floor(x), Math.ceil(y));
        const bottom_right = this.getVertexHeight(Math.ceil(x), Math.ceil(y));

        const y1 = ((maxX - x) / (maxX - minX)) * top_left + ((x - minX) / (maxX - minX)) * top_right;
        const y2 = ((maxX - x) / (maxX - minX)) * bottom_left + ((x - minX) / (maxX - minX)) * bottom_right;

        const result = ((maxY - y) / (maxY - minY)) * y1 + ((y - minY) / (maxY - minY)) * y2;
        return result;
    }

    getTileAt(x: number, y: number): TILE_TYPE {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return 0; }
        return this._tileMap[y * this._width + x];
    }

    getVertexHeight(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return 0; }
        return this._heightMap[y * this._width + x];
    }

    setVertexHeight(x: number, y: number, height: number) {
        this._heightMap[y * this._width + x] = height;
    }

    raiseTile(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        const north = this.getVertexHeight(x, y);
        const east = this.getVertexHeight(x + 1, y);
        const south = this.getVertexHeight(x + 1, y + 1);
        const west = this.getVertexHeight(x, y + 1);

        const height = Math.min(north, east, south, west);

        if (north <= height) {
            this.incrementVertexHeight(x, y);
        }
        if (east <= height) {
            this.incrementVertexHeight(x + 1, y);
        }
        if (south <= height) {
            this.incrementVertexHeight(x + 1, y + 1);
        }
        if (west <= height) {
            this.incrementVertexHeight(x, y + 1);
        }
    }

    lowerTile(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        const north = this.getVertexHeight(x, y);
        const east = this.getVertexHeight(x + 1, y);
        const south = this.getVertexHeight(x + 1, y + 1);
        const west = this.getVertexHeight(x, y + 1);

        const height = Math.max(north, east, south, west);

        if (north >= height) {
            this.decrementVertexHeight(x, y);
        }
        if (east >= height) {
            this.decrementVertexHeight(x + 1, y);
        }
        if (south >= height) {
            this.decrementVertexHeight(x + 1, y + 1);
        }
        if (west >= height) {
            this.decrementVertexHeight(x, y + 1);
        }
    }

    setCliffHeight(tileX: number, tileY: number, step = 0) {
        const baseHeight = this.getVertexHeight(tileX, tileY);
        if (baseHeight % CLIFF_HEIGHT) { return; }
        for (let y = tileY - 1; y < tileY + 3; ++y) {
            for (let x = tileX - 1; x < tileX + 3; ++x) {
                if (this.getVertexHeight(x, y) !== step * CLIFF_HEIGHT && this.getVertexHeight(x, y) !== (step - 1) * CLIFF_HEIGHT) {
                    return;
                }
            }
        }
        this.setTileHeight(tileX, tileY, CLIFF_HEIGHT * step);
    }

    private generateHeightMap(t: number = 0): void {
        const rate = 16;
        const rate2 = 16;
        
        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const z = Math.floor(Math.sin((x + t * 0.25) / rate) * rate) - Math.floor(Math.sin((y + t) / rate2) * rate2);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
            this._heightMap.push(z);
        }
    }

    private setTileHeight(x: number, y: number, height: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        this.setVertexHeight(x, y, height);
        this.setVertexHeight(x + 1, y, height);
        this.setVertexHeight(x + 1, y + 1, height);
        this.setVertexHeight(x, y + 1, height);
    }

    private incrementVertexHeight(x: number, y: number): boolean {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const center = this.getVertexHeight(x, y);
        let north = this.getVertexHeight(x, y - 1);
        let east = this.getVertexHeight(x + 1, y);
        let south = this.getVertexHeight(x, y + 1);
        let west = this.getVertexHeight(x - 1, y);

        if (center - north === 1) {
            this.incrementVertexHeight(x, y - 1);
        }
        if (center - east === 1) {
            this.incrementVertexHeight(x + 1, y);
        }
        if (center - south === 1) {
            this.incrementVertexHeight(x, y + 1);
        }
        if (center - west === 1) {
            this.incrementVertexHeight(x - 1, y);
        }

        north = this.getVertexHeight(x, y - 1);
        east = this.getVertexHeight(x + 1, y);
        south = this.getVertexHeight(x, y + 1);
        west = this.getVertexHeight(x - 1, y);
        const north_east = this.getVertexHeight(x + 1, y - 1);
        const north_west = this.getVertexHeight(x - 1, y - 1);
        const south_east = this.getVertexHeight(x + 1, y + 1);
        const south_west = this.getVertexHeight(x - 1, y + 1);
        if (center - north >= -1 && center - north <= 0 &&
            center - east >= -1 && center - east <= 0 &&
            center - south >= -1 && center - south <= 0 &&
            center - west >= -1 && center - west <= 0 &&
            center - north_east >= -2 && center - north_east <= 1 &&
            center - north_west >= -2 && center - north_west <= 1 &&
            center - south_east >= -2 && center - south_east <= 1 &&
            center - south_west >= -2 && center - south_west <= 1) {
            this.setVertexHeight(x, y, center + 1);
        }
    }

    private decrementVertexHeight(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const center = this.getVertexHeight(x, y);
        let north = this.getVertexHeight(x, y - 1);
        let east = this.getVertexHeight(x + 1, y);
        let south = this.getVertexHeight(x, y + 1);
        let west = this.getVertexHeight(x - 1, y);

        if (center - north === -1) {
            this.decrementVertexHeight(x, y - 1);
        }
        if (center - east === -1) {
            this.decrementVertexHeight(x + 1, y);
        }
        if (center - south === -1) {
            this.decrementVertexHeight(x, y + 1);
        }
        if (center - west === -1) {
            this.decrementVertexHeight(x - 1, y);
        }
        north = this.getVertexHeight(x, y - 1);
        east = this.getVertexHeight(x + 1, y);
        south = this.getVertexHeight(x, y + 1);
        west = this.getVertexHeight(x - 1, y);
        const north_east = this.getVertexHeight(x + 1, y - 1);
        const north_west = this.getVertexHeight(x - 1, y - 1);
        const south_east = this.getVertexHeight(x + 1, y + 1);
        const south_west = this.getVertexHeight(x - 1, y + 1);
        if (center - north >= 0 && center - north <= 1 &&
            center - east >= 0 && center - east <= 1 &&
            center - south >= 0 && center - south <= 1 &&
            center - west >= 0 && center - west <= 1 &&
            center - north_east >= -1 && center - north_east <= 2 &&
            center - north_west >= -1 && center - north_west <= 2 &&
            center - south_east >= -1 && center - south_east <= 2 &&
            center - south_west >= -1 && center - south_west <= 2) {
            this.setVertexHeight(x, y, center - 1);
        }
    }

}