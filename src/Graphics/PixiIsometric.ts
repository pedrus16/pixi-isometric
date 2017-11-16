import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricTileMap } from './PixiIsometricTileMap';
import { HeightMap } from '../HeightMap';
import { TILE_TYPE } from '../Map';


export class PixiIsometric {
	
    private _graphics: PixiGraphics;
    private _container: any;
    private _heightMap: HeightMap;
    private _tileTypeMap: TILE_TYPE[];
    private _tileMap: PixiIsometricTileMap;

	constructor(graphics: PixiGraphics, heightMap: HeightMap, tileTypeMap: TILE_TYPE[]) {
        this._graphics = graphics;
        this._heightMap = heightMap;
        this._tileTypeMap = tileTypeMap;
        this._tileMap = new PixiIsometricTileMap(this._heightMap, this._tileTypeMap);
        // this._tileMap.sprites.forEach((sprite) => this._graphics.camera.addChild(sprite));
        this._graphics.camera.addChild(this._tileMap.container);
        
    }

    update() {
        this._tileMap.update(this._heightMap, this._tileTypeMap);
    }

    addSprite(sprite: any) {
        this._graphics.camera.addChild(sprite);
    }

}