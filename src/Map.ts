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
        return this._heightMap[y * this._width + x];
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

}