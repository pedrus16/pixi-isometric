import { HeightMap, SLOPE } from './HeightMap';
import { Entity } from './Entity';
import { Tree } from './Tree';
import { PixiGraphics } from './Graphics/PixiGraphics';
import { PixiIsometric } from './Graphics/PixiIsometric';

export enum TILE_TYPE {
    DIRT,
    GRASS,
    WATER,
};


export class Map {

    private _graphics: PixiGraphics;
    private _isometricGraphics: PixiIsometric;
    private _heightMap: HeightMap;
    private _tileTypeMap: TILE_TYPE[];
    private _trees: Tree[] = [];

    constructor(graphics: PixiGraphics, heightMap: HeightMap) {
        this._graphics = graphics;
        this._heightMap = heightMap;
        this._tileTypeMap = [];
        for (let i = 0; i < (this._heightMap.width + 1) * (this._heightMap.height + 1); ++i) { this._tileTypeMap.push(TILE_TYPE.GRASS); }
        this._isometricGraphics = new PixiIsometric(this._graphics, this._heightMap, this._tileTypeMap);
    }

    get heightMap() { return this._heightMap; }

    addTree(x: number, y: number) {
        if (x < 0 || x >= this._heightMap.width || y < 0 || y >= this._heightMap.height) { return; }
        const found = this._trees.find((tree) => {
            return tree.x >= x && tree.x <= x + 1 && tree.y >= y && tree.y <= y + 1;
        });
        if (found) { return; }
        const height = this._heightMap.getHeightAt(x + 0.5, y + 0.5);
        const tree = new Tree(x + 0.5, y + 0.5, height);
        this._isometricGraphics.addSprite(tree.sprite);
        this._trees.push(tree);
    }

    removeTree(x: number, y: number) {
        const found = this._trees.find((tree) => tree.x >= x && tree.x <= x + 1 && tree.y >= y && tree.y <= y + 1);
        if (!found) { return; }
        this._trees = this._trees.filter((tree) => tree !== found);
        found.destroy();
    }

    updateGraphics() {
        this._isometricGraphics.update();
        this._trees.forEach((tree) => tree.z = this._heightMap.getHeightAt(tree.x, tree.y));
    }

    getVertexType(x: number, y: number): TILE_TYPE {
        if (x < 0 || y < 0 || x >= (this._heightMap.width + 1) || y >= (this._heightMap.height + 1)) { return 0; }
        return this._tileTypeMap[y * (this._heightMap.width + 1) + x];
    }

    setVertexType(x: number, y: number, type: TILE_TYPE) {
        if (x < 0 || y < 0 || x >= (this._heightMap.width + 1) || y >= (this._heightMap.height + 1)) { return; }
        if (this._heightMap.getSlope(x, y) !== SLOPE.FLAT) { return; } 
        this._tileTypeMap[y * (this._heightMap.width + 1) + x] = type;
        this._isometricGraphics.update();
    }

}