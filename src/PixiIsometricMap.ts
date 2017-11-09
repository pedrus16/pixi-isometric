import { Map } from './Map';
import { PixiGraphics } from './PixiGraphics';

import tilesJSON from './tiles.json';

enum SLOPE {
    FLAT = 0b00000,
    NORTH = 0b01000,
    EAST = 0b00100,
    SOUTH = 0b00010,
    WEST = 0b00001,
    STEEP = 0b10000,
};

const TILEMAP = {
    [SLOPE.FLAT]: "tile_01.png",

    [SLOPE.NORTH]: "tile_05.png",
    [SLOPE.EAST]: "tile_06.png",
    [SLOPE.SOUTH]: "tile_07.png",
    [SLOPE.WEST]: "tile_08.png",

    [SLOPE.NORTH|SLOPE.EAST]: "tile_09.png",
    [SLOPE.SOUTH|SLOPE.EAST]: "tile_10.png",
    [SLOPE.SOUTH|SLOPE.WEST]: "tile_11.png",
    [SLOPE.NORTH|SLOPE.WEST]: "tile_12.png",

    [SLOPE.NORTH|SLOPE.SOUTH]: "tile_13.png",
    [SLOPE.WEST|SLOPE.EAST]: "tile_14.png",

    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH]: "tile_19.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST]: "tile_20.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH]: "tile_19.png",
    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST]: "tile_18.png",

    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST|SLOPE.STEEP]: "tile_21.png",
    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH|SLOPE.STEEP]: "tile_22.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST|SLOPE.STEEP]: "tile_23.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH|SLOPE.STEEP]: "tile_24.png",
};

const TILE_WIDTH = 64;
const TILE_HEIGHT = 16;


function toIso(x: number, y: number): [number, number] {
    const isoX = x * TILE_WIDTH * 0.5 - y * TILE_WIDTH * 0.5;
    const isoY = y * TILE_WIDTH * 0.25 + x * TILE_WIDTH * 0.25;
    return [isoX, isoY];
}

export class PixiIsometricMap {

    private _graphics: PixiGraphics;
    private _map: Map;

    public container: any;

    constructor(graphics: PixiGraphics, map: Map) {
        this._graphics = graphics;
        this._map = map;

        PIXI.loader.add(tilesJSON).load(() => this.initialize());
        this.container =  new PIXI.Container();
        // this.container.scale.x = 0.5;
        // this.container.scale.y = 0.5;
    }

    private initialize() {
        this._graphics.camera.addChild(this.container);
        for (let y = 0; y < this._map.height; ++y) {
            for (let x = 0; x < this._map.width; ++x) {
                const texture = PIXI.utils.TextureCache[this.getTextureAt(x, y)];
                if (texture) {
                    const sprite = new PIXI.Sprite(texture);
                    sprite.anchor.x = 0.5;
                    sprite.anchor.y = 1;
                    const isoCoords = toIso(x, y);
                    sprite.x = isoCoords[0];
                    sprite.y = isoCoords[1] - this.getHeightAt(x, y) * TILE_HEIGHT + TILE_WIDTH * 0.5;
                    this.container.addChild(sprite);
                }
            }
        }
        // this.container.cacheAsBitmap = true;
        // this.container.pivot.y = this.container.height * 0.5 / this.container.scale.y;
    }

    private getTextureAt(x: number, y: number): string {
        const height_min = this.getHeightAt(x, y);
        const height_north = this._map.getVertexHeight(x, y) - height_min;
        const height_east = this._map.getVertexHeight(x+1, y) - height_min;
        const height_south = this._map.getVertexHeight(x+1, y+1) - height_min;
        const height_west = this._map.getVertexHeight(x, y+1) - height_min;

        const slope_north = height_north > 0 ? SLOPE.NORTH : 0;
        const slope_east = height_east > 0 ? SLOPE.EAST : 0;
        const slope_south = height_south > 0 ? SLOPE.SOUTH : 0;
        const slope_west = height_west > 0 ? SLOPE.WEST : 0;
        const slope_steep = height_north + height_east + height_south + height_west >= 4 ? SLOPE.STEEP : 0;

        return TILEMAP[slope_north|slope_east|slope_south|slope_west|slope_steep];
    }

    private getHeightAt(x: number, y: number): number {
        const north = this._map.getVertexHeight(x, y);
        const east = this._map.getVertexHeight(x+1, y);
        const south = this._map.getVertexHeight(x+1, y+1);
        const west = this._map.getVertexHeight(x, y+1);

        return Math.min(north, east, south, west);
    }

}