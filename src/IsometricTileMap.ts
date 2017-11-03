import { Entity } from './Entity';
import { Graphics, Container, Sprite } from './Graphics';


export const TILESET = [
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
    "landscapeTiles_071.png",
    "landscapeTiles_072.png",
    "landscapeTiles_073.png",
    "landscapeTiles_074.png",
    "landscapeTiles_075.png",
    "landscapeTiles_076.png",
    "landscapeTiles_077.png",
    "landscapeTiles_078.png",
    "landscapeTiles_079.png",
    "landscapeTiles_080.png",
    "landscapeTiles_081.png",
    "landscapeTiles_082.png",
    "landscapeTiles_083.png",
    "landscapeTiles_084.png",
    "landscapeTiles_085.png",
    "landscapeTiles_086.png",
    "landscapeTiles_087.png",
    "landscapeTiles_088.png",
    "landscapeTiles_089.png",
    "landscapeTiles_090.png",
    "landscapeTiles_091.png",
    "landscapeTiles_092.png",
    "landscapeTiles_093.png",
    "landscapeTiles_094.png",
    "landscapeTiles_095.png",
    "landscapeTiles_096.png",
    "landscapeTiles_097.png",
    "landscapeTiles_098.png",
    "landscapeTiles_099.png",
    "landscapeTiles_100.png",
    "landscapeTiles_101.png",
    "landscapeTiles_102.png",
    "landscapeTiles_103.png",
    "landscapeTiles_104.png",
    "landscapeTiles_105.png",
    "landscapeTiles_106.png",
    "landscapeTiles_107.png",
    "landscapeTiles_108.png",
    "landscapeTiles_109.png",
    "landscapeTiles_110.png",
    "landscapeTiles_111.png",
    "landscapeTiles_112.png",
    "landscapeTiles_113.png",
    "landscapeTiles_114.png",
    "landscapeTiles_115.png",
    "landscapeTiles_116.png",
    "landscapeTiles_117.png",
    "landscapeTiles_118.png",
    "landscapeTiles_119.png",
    "landscapeTiles_120.png",
    "landscapeTiles_121.png",
    "landscapeTiles_122.png",
    "landscapeTiles_123.png",
    "landscapeTiles_124.png",
    "landscapeTiles_125.png",
    "landscapeTiles_126.png",
    "landscapeTiles_127.png",
];

const TILE_WIDTH = 92;
const TILE_HEIGHT = 32;

export class Tile {

    private _x: number;
    private _y: number;
    private _z: number;
    private _tile: number;
    private _sprite: Sprite;

    constructor(x: number, y: number, z: number, tile: number, graphics: Graphics) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._tile = tile;
        this._sprite = graphics.createSprite(TILESET[tile]);
        const isoPos = this.toIso(x, y);
        this._sprite.x = isoPos.x * TILE_WIDTH;
        this._sprite.y = isoPos.y * TILE_WIDTH - this._sprite.height + 91 - z * TILE_HEIGHT;
        this._sprite.z = z;
    }

    get tile(): number { return this._tile; }
    set tile(tile: number) {
        if (this._tile === tile) { return; }
        this._sprite.texture = TILESET[tile];
    }

    get sprite(): Sprite { return this._sprite; }

    get x(): number { return this._x; }
    set x(x: number) {
        this._x = x;
        const isoPos = this.toIso(x, this._y);
        this._sprite.x = isoPos.x * TILE_WIDTH;
        this._sprite.y = isoPos.y * TILE_WIDTH - this._sprite.height + 91 - this._z * TILE_HEIGHT;
    }

    get y(): number { return this._y; }
    set y(y: number) {
        this._y = y;
        const isoPos = this.toIso(this._x, y);
        this._sprite.x = isoPos.x * TILE_WIDTH;
        this._sprite.y = isoPos.y * TILE_WIDTH - this._sprite.height + 91 - this._z * TILE_HEIGHT;
    }

    get z(): number { return this._z; }
    set z(z: number) { 
        this._z = z; 
        const isoPos = this.toIso(this._x, this._y);
        this._sprite.y = isoPos.y * TILE_WIDTH - this._sprite.height + 91 - this._z * TILE_HEIGHT;
        this._sprite.z = z;
    }

    private toIso(x: number, y: number): { x: number, y: number } {
        const transform = new PIXI.Matrix(1, 0, 0, 1, x, this._y);
        transform.rotate(Math.PI * 0.25);
        transform.scale(1, 0.5);
        return { x: transform.tx, y: transform.ty };
    }

}

export class IsometricTileMap extends Entity {

    private _width: number;
    private _height: number;
    private _container: Container;
    private _tiles: { [key: number]: Tile };
    private _particleContainer: Container;

    constructor(width: number, height: number, graphics: Graphics, container: Container) {
        super(0, 0, graphics);

        this._width = width;
        this._height = height;
        this._container = container;
        this._tiles = {};
    }

    initialize() {
        super.initialize();

        this._particleContainer = this.graphics.createContainer();
        this._container.add(this._particleContainer);
    }

    setTiles(tiles: { x: number, y: number, z: number, tile: number }[]) {
        tiles.forEach((tile) => {
            if (tile.x < 0 || tile.x >= this._width) { return }
            if (tile.y < 0 || tile.y >= this._height) { return; }

            const index = tile.y * this._width + tile.x;
            let tileObject = this._tiles[index];
            if (!tileObject) {
                tileObject = new Tile(tile.x, tile.y, tile.z, tile.tile, this.graphics);
                tileObject.x = tile.x;
                tileObject.y = tile.y;
                this._tiles[index] = tileObject;
                this._particleContainer.add(tileObject.sprite);
            }
            tileObject.z = tile.z;
            tileObject.tile = tile.tile;
        });
    }

    update(dt: number) {
        // for (let i = 0; i < this._sprites.length; ++i) {
        //     const sprite = this._sprites[i];
        //     sprite.render = true; // TODO
        // }
    }

}

export default IsometricTileMap;