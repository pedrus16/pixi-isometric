import { PixiGraphics } from './PixiGraphics';
import { PixiIsometricTileMap } from './PixiIsometricTileMap';
import { HeightMap } from './HeightMap';

export class PixiIsometric {
	
    private _graphics: PixiGraphics;
    private _container: any;
    private _heightMap: HeightMap;
    private _tileMap: PixiIsometricTileMap;

	constructor(graphics: PixiGraphics, heightMap: HeightMap) {
        this._graphics = graphics;
        this._heightMap = heightMap;
        this._tileMap = new PixiIsometricTileMap(this._heightMap);
        // this._tileMap.sprites.forEach((sprite) => this._graphics.camera.addChild(sprite));
        this._graphics.camera.addChild(this._tileMap.container);
        
    }

    update() {
        this._tileMap.update(this._heightMap);
    }

    addSprite(sprite: any) {
        this._graphics.camera.addChild(sprite);
    }

}