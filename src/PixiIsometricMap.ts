import { Map, CLIFF_HEIGHT } from './Map';
import { PixiGraphics } from './PixiGraphics';

import tilesJSON from './tiles.json';
import cliffJSON from './cliff.json';

enum SLOPE {
    FLAT = 0b000000,
    NORTH = 0b001000,
    EAST = 0b000100,
    SOUTH = 0b000010,
    WEST = 0b000001,
    STEEP = 0b010000,
    CLIFF = 0b100000,
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

    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH]: "tile_17.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST]: "tile_18.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH]: "tile_19.png",
    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST]: "tile_20.png",

    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST|SLOPE.STEEP]: "tile_21.png",
    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH|SLOPE.STEEP]: "tile_22.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST|SLOPE.STEEP]: "tile_23.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH|SLOPE.STEEP]: "tile_24.png",

    [SLOPE.CLIFF|SLOPE.NORTH]: "cliff_north.png",
    [SLOPE.CLIFF|SLOPE.EAST]: "cliff_east.png",
    [SLOPE.CLIFF|SLOPE.SOUTH]: "cliff_south.png",
    [SLOPE.CLIFF|SLOPE.WEST]: "cliff_west.png",

    [SLOPE.CLIFF|SLOPE.NORTH|SLOPE.EAST]: "cliff_north_east.png",
    [SLOPE.CLIFF|SLOPE.SOUTH|SLOPE.EAST]: "cliff_south_east.png",
    [SLOPE.CLIFF|SLOPE.SOUTH|SLOPE.WEST]: "cliff_south_west.png",
    [SLOPE.CLIFF|SLOPE.NORTH|SLOPE.WEST]: "cliff_north_west.png",

    [SLOPE.CLIFF|SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST]: "cliff_north_east_west.png",
    [SLOPE.CLIFF|SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH]: "cliff_east_south_north.png",
    [SLOPE.CLIFF|SLOPE.SOUTH|SLOPE.EAST|SLOPE.WEST]: "cliff_south_west_east.png",
    [SLOPE.CLIFF|SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH]: "cliff_west_north_south.png",

    [SLOPE.CLIFF|SLOPE.NORTH|SLOPE.SOUTH]: "cliff_north_south.png",
    [SLOPE.CLIFF|SLOPE.WEST|SLOPE.EAST]: "cliff_west_east.png",
};

const TILE_WIDTH = 64;
const TILE_HEIGHT = 16;
const CHUNK_SIZE = 64;

function toIso(x: number, y: number, width = TILE_WIDTH): [number, number] {
    const isoX = (x * 0.5 - y * 0.5) * width;
    const isoY = (y * 0.25 + x * 0.25) * width;
    return [isoX, isoY];
}

export class PixiIsometricMap {

    private _graphics: PixiGraphics;
    private _map: Map;

    public container: any;
    private chunks: { container: any, sprites: any[] }[] = [];

    constructor(graphics: PixiGraphics, map: Map) {
        this._graphics = graphics;
        this._map = map;

        PIXI.loader.add([tilesJSON, cliffJSON]).load(() => this.initialize());
        this.container =  new PIXI.Container();
    }

    private initialize() {

        const chunksX = this._map.width / CHUNK_SIZE;
        const chunksY = this._map.height / CHUNK_SIZE;

        for (let cy = 0; cy < Math.ceil(chunksY); ++cy) {
            for (let cx = 0; cx < Math.ceil(chunksX); ++cx) {
                const chunk_container = new PIXI.Container();
                this.container.addChild(chunk_container);

                const isoCoords = toIso(cx, cy, TILE_WIDTH * (CHUNK_SIZE));
                chunk_container.x = isoCoords[0];
                chunk_container.y = isoCoords[1];

                const sprites: any[] = [];
                const chunk = { container: chunk_container, sprites: sprites };
                this.chunks.push(chunk);

                const sizeX = chunksX - cx >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksX - cx);
                const sizeY = chunksY - cy >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksY - cy);
                for (let y = 0; y < sizeY; ++y) {
                    for (let x = 0; x < sizeX; ++x) {
                        const texture = PIXI.utils.TextureCache[this.getTextureAt(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y)];
                        if (texture) {
                            const sprite = new PIXI.Sprite(texture);
                            sprites.push(sprite);
                            sprite.anchor.x = 0.5;
                            sprite.anchor.y = 1;
                            const isoCoords = toIso(x, y);
                            sprite.x = isoCoords[0];
                            sprite.y = isoCoords[1] - this.getHeightAt(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y) * TILE_HEIGHT + TILE_WIDTH * 0.5;
                            chunk_container.addChild(sprite);
                        }
                    }
                }
                // chunk_container.cacheAsBitmap = true;
            }
        }
        this._graphics.camera.addChild(this.container);
        // this.container.pivot.y = this.container.height * 0.5 / this.container.scale.y;
    }

    update() {
        const chunksX = this._map.width / CHUNK_SIZE;
        const chunksY = this._map.height / CHUNK_SIZE;
        this.chunks.forEach((chunk, chunk_index) => {
            // chunk.container.cacheAsBitmap = false;
            const cx = chunk_index % Math.ceil(chunksX);
            const cy = Math.floor(chunk_index / Math.ceil(chunksY));
            const sizeX = chunksX - cx >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksX - cx);
            const sizeY = chunksY - cy >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksY - cy);
            chunk.sprites.forEach((sprite, sprite_index) => {
                const x = sprite_index % sizeX;
                const y = Math.floor(sprite_index / sizeX);
                const texture = PIXI.utils.TextureCache[this.getTextureAt(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y)];
                if (texture) {
                    sprite.texture = PIXI.utils.TextureCache[this.getTextureAt(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y)];
                }
                else {
                    sprite.texture = PIXI.Texture.EMPTY;
                }
                const isoCoords = toIso(x, y);
                sprite.y = isoCoords[1] - this.getHeightAt(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y) * TILE_HEIGHT + TILE_WIDTH * 0.5;
            });
            // chunk.container.cacheAsBitmap = true;
        });
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
        const slope_steep = height_north === 2 || height_east === 2 || height_south === 2 || height_west === 2 ? SLOPE.STEEP : 0;
        const cliff = height_north === CLIFF_HEIGHT || height_east === CLIFF_HEIGHT || height_south === CLIFF_HEIGHT || height_west === CLIFF_HEIGHT ? SLOPE.CLIFF : 0;

        return TILEMAP[slope_north|slope_east|slope_south|slope_west|slope_steep|cliff];
    }

    private getHeightAt(x: number, y: number): number {
        const north = this._map.getVertexHeight(x, y);
        const east = this._map.getVertexHeight(x+1, y);
        const south = this._map.getVertexHeight(x+1, y+1);
        const west = this._map.getVertexHeight(x, y+1);

        return Math.min(north, east, south, west);
    }

}