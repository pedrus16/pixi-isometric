import { Entity } from './Entity';
import { Graphics, Sprite } from './Graphics';


export class Tile {

    private _x: number;
    private _y: number;
    private _sprite: Sprite;

    constructor(x: number, y: number, sprite: Sprite) {
        this._x = x;
        this._y = y;
        this._sprite = sprite;
    }

    get sprite(): Sprite { return this._sprite; }

}

export class IsometricTerrain extends Entity {

    private _width: number;
    private _height: number;
    private _tileset: string[];
    private _tiles: Tile[];

    constructor(width: number, height: number) {
        super();
        this._width = width;
        this._height = height;
        this._tiles = [];
        this._tileset = [
            "landscapeTiles_001.png",
            "landscapeTiles_002.png",
            "landscapeTiles_003.png",
            "landscapeTiles_004.png",
            "landscapeTiles_005.png",
            "landscapeTiles_006.png",
            "landscapeTiles_007.png",
            "landscapeTiles_008.png",
            "landscapeTiles_009.png",
            "landscapeTiles_010.png",
            "landscapeTiles_011.png",
            "landscapeTiles_012.png",
            "landscapeTiles_013.png",
            "landscapeTiles_014.png",
            "landscapeTiles_015.png",
            "landscapeTiles_016.png",
            "landscapeTiles_017.png",
            "landscapeTiles_018.png",
            "landscapeTiles_019.png",
            "landscapeTiles_020.png",
            "landscapeTiles_021.png",
            "landscapeTiles_022.png",
            "landscapeTiles_023.png",
            "landscapeTiles_024.png",
            "landscapeTiles_025.png",
            "landscapeTiles_026.png",
            "landscapeTiles_027.png",
            "landscapeTiles_028.png",
            "landscapeTiles_029.png",
            "landscapeTiles_030.png",
            "landscapeTiles_031.png",
            "landscapeTiles_032.png",
            "landscapeTiles_033.png",
            "landscapeTiles_034.png",
            "landscapeTiles_035.png",
            "landscapeTiles_036.png",
            "landscapeTiles_037.png",
            "landscapeTiles_038.png",
            "landscapeTiles_039.png",
            "landscapeTiles_040.png",
            "landscapeTiles_041.png",
            "landscapeTiles_042.png",
            "landscapeTiles_043.png",
            "landscapeTiles_044.png",
            "landscapeTiles_045.png",
            "landscapeTiles_046.png",
            "landscapeTiles_047.png",
            "landscapeTiles_048.png",
            "landscapeTiles_049.png",
            "landscapeTiles_050.png",
            "landscapeTiles_051.png",
            "landscapeTiles_052.png",
            "landscapeTiles_053.png",
            "landscapeTiles_054.png",
            "landscapeTiles_055.png",
            "landscapeTiles_056.png",
            "landscapeTiles_057.png",
            "landscapeTiles_058.png",
            "landscapeTiles_059.png",
            "landscapeTiles_060.png",
            "landscapeTiles_061.png",
            "landscapeTiles_062.png",
            "landscapeTiles_063.png",
            "landscapeTiles_064.png",
            "landscapeTiles_065.png",
            "landscapeTiles_066.png",
            "landscapeTiles_067.png",
            "landscapeTiles_068.png",
            "landscapeTiles_069.png",
            "landscapeTiles_070.png",
        ];
    }

    initialize(graphics: Graphics) {
        super.initialize(graphics);

        for (let i = 0; i < this._width * this._height; i++) {
            const randomIndex = Math.floor(Math.random() * this._tileset.length);
            const sprite = graphics.createSprite(this._tileset[66]);
            const x = (i % this._width);
            const y = Math.floor(i / this._width);
            const tile = new Tile(x, y, sprite);
            this._tiles.push(tile);

            const transform = new PIXI.Matrix(1, 0, 0, 1, x, y);
            transform.rotate(Math.PI * 0.25);
            transform.scale(1, 0.5);

            sprite.x = transform.tx * 91;
            sprite.y = transform.ty * 91 - sprite.height + 91;
            graphics.addSprite(sprite);
        }
    }

    update(dt: number) {}

}

export default IsometricTerrain;