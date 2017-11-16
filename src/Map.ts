import { HeightMap } from './HeightMap';
import { Entity } from './Entity';
import { Tree } from './Tree';
import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricTileMap } from './PixiIsometricTileMap';



export class Map {

    private _graphics: PixiGraphics;
    private _isometricGraphics: PixiIsometricTileMap;
    private _heightMap: HeightMap;
    private _trees: Tree[] = [];

    constructor(graphics: PixiGraphics, heightMap: HeightMap) {
        this._graphics = graphics;
        this._heightMap = heightMap;
        this._isometricGraphics = new PixiIsometricTileMap(this._graphics, this._heightMap);
    }

    get heightMap() { return this._heightMap; }

    addTree(x: number, y: number) {
        const found = this._trees.find((tree) => {
            return tree.x >= x && tree.x <= x + 1 && tree.y >= y && tree.y <= y + 1;
        });
        if (found) { return; }
        const height = this._heightMap.getHeightAt(x + 0.5, y + 0.5);
        const tree = new Tree(x + 0.5, y + 0.5, height);
        this._graphics.camera.addChild(tree.sprite);
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

}