import { Entity } from './Entity';


export class Map extends Entity {

    private _heightMap: number[];
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
        // this.generateHeightMap();
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

    getVertexHeight(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return 0; }
        return this._heightMap[y * this._width + x];
    }

    setVertexHeight(x: number, y: number, height: number) {
        this._heightMap[y * this._width + x] = height;
    }

    generateHeightMap(t: number = 0): void {
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

    setTileHeight(x: number, y: number, height: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        this.setVertexHeight(x, y, height);
        this.setVertexHeight(x + 1, y, height);
        this.setVertexHeight(x + 1, y + 1, height);
        this.setVertexHeight(x, y + 1, height);
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

    private incrementVertexHeight(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const center = this.getVertexHeight(x, y);
        const north = this.getVertexHeight(x, y - 1);
        const east = this.getVertexHeight(x + 1, y);
        const south = this.getVertexHeight(x, y + 1);
        const west = this.getVertexHeight(x - 1, y);

        this.setVertexHeight(x, y, center + 1);
        if (center - north > 0 && center - north <= 1) {
            this.incrementVertexHeight(x, y - 1);
        }
        if (center - east > 0 && center - north <= 1) {
            this.incrementVertexHeight(x + 1, y);
        }
        if (center - south > 0 && center - north <= 1) {
            this.incrementVertexHeight(x, y + 1);
        }
        if (center - west > 0 && center - north <= 1) {
            this.incrementVertexHeight(x - 1, y);
        }
    }

    private decrementVertexHeight(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const center = this.getVertexHeight(x, y);
        const north = this.getVertexHeight(x, y - 1);
        const east = this.getVertexHeight(x + 1, y);
        const south = this.getVertexHeight(x, y + 1);
        const west = this.getVertexHeight(x - 1, y);

        this.setVertexHeight(x, y, center - 1);
        if (center - north < 0) {
            this.decrementVertexHeight(x, y - 1);
        }
        if (center - east < 0) {
            this.decrementVertexHeight(x + 1, y);
        }
        if (center - south < 0) {
            this.decrementVertexHeight(x, y + 1);
        }
        if (center - west < 0) {
            this.decrementVertexHeight(x - 1, y);
        }
    }

    setCliffHeight(x: number, y: number, step = 0) {
        this.setTileHeight(x, y, 6 * step);
    }

}