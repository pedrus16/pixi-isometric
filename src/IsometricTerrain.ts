import { Entity } from './Entity';
import { Graphics, Sprite } from './Graphics';


export class Tile {

    private _x: number;
    private _y: number;
    private _tile: number;

    constructor(x: number, y: number, tile: number) {
        this._x = x;
        this._y = y;
        this._tile = tile;
    }

}

export class IsometricTerrain extends Entity {

    private _width: number;
    private _height: number;
    private _tiles: number[];

    private sprite: Sprite;

    constructor(x: number, y: number, width: number, height: number, tileset: string[]) {
        super(x, y);
        this._width = width;
        this._height = height;
    }

    initialize(graphics: Graphics) {
        super.initialize(graphics);
        const width = 100;
        for (let i = 0; i < this._width * this._height; i++) {
            this.sprite = graphics.createSprite("landscapeTiles_067.png");
            const x = (i % this._width);
            const y = Math.floor(i / this._width);
            
            const transform = new PIXI.Matrix(1, 0, 0, 1, x, y);
            transform.rotate(Math.PI * 0.25);
            transform.scale(1, 0.5);

            this.sprite.x = transform.tx * 91;
            this.sprite.y = transform.ty * 91;
            graphics.addSprite(this.sprite);
        }
    }

    update(dt: number) {
    }

}

export default IsometricTerrain;