import { PixiGraphics } from './PixiGraphics';
import { HeightMap, CLIFF_HEIGHT } from '../HeightMap';
import { TILE_TYPE } from '../Map';

export const TILE_WIDTH = 64;
export const LAYER_HEIGHT = 16;
const CHUNK_SIZE = 64;

import { toIso } from '../utils';

enum SLOPE {
    FLAT = 0b000000,
    NORTH = 0b001000,
    EAST = 0b000100,
    SOUTH = 0b000010,
    WEST = 0b000001,
    STEEP = 0b010000,
    CLIFF = 0b100000,
};

const GRASS_TILEMAP = {
    [SLOPE.FLAT]: "grass_01.png",

    [SLOPE.NORTH]: "grass_05.png",
    [SLOPE.EAST]: "grass_06.png",
    [SLOPE.SOUTH]: "grass_07.png",
    [SLOPE.WEST]: "grass_08.png",

    [SLOPE.NORTH|SLOPE.EAST]: "grass_09.png",
    [SLOPE.SOUTH|SLOPE.EAST]: "grass_10.png",
    [SLOPE.SOUTH|SLOPE.WEST]: "grass_11.png",
    [SLOPE.NORTH|SLOPE.WEST]: "grass_12.png",

    [SLOPE.NORTH|SLOPE.SOUTH]: "grass_13.png",
    [SLOPE.WEST|SLOPE.EAST]: "grass_14.png",

    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH]: "grass_17.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST]: "grass_18.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH]: "grass_19.png",
    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST]: "grass_20.png",

    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST|SLOPE.STEEP]: "grass_21.png",
    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH|SLOPE.STEEP]: "grass_22.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST|SLOPE.STEEP]: "grass_23.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH|SLOPE.STEEP]: "grass_24.png",

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

const DIRT_TILEMAP = {
    [SLOPE.FLAT]: "dirt_01.png",

    [SLOPE.NORTH]: "dirt_05.png",
    [SLOPE.EAST]: "dirt_06.png",
    [SLOPE.SOUTH]: "dirt_07.png",
    [SLOPE.WEST]: "dirt_08.png",

    [SLOPE.NORTH|SLOPE.EAST]: "dirt_09.png",
    [SLOPE.SOUTH|SLOPE.EAST]: "dirt_10.png",
    [SLOPE.SOUTH|SLOPE.WEST]: "dirt_11.png",
    [SLOPE.NORTH|SLOPE.WEST]: "dirt_12.png",

    [SLOPE.NORTH|SLOPE.SOUTH]: "dirt_13.png",
    [SLOPE.WEST|SLOPE.EAST]: "dirt_14.png",

    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH]: "dirt_17.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST]: "dirt_18.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH]: "dirt_19.png",
    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST]: "dirt_20.png",

    [SLOPE.NORTH|SLOPE.EAST|SLOPE.WEST|SLOPE.STEEP]: "dirt_21.png",
    [SLOPE.EAST|SLOPE.SOUTH|SLOPE.NORTH|SLOPE.STEEP]: "dirt_22.png",
    [SLOPE.SOUTH|SLOPE.WEST|SLOPE.EAST|SLOPE.STEEP]: "dirt_23.png",
    [SLOPE.WEST|SLOPE.NORTH|SLOPE.SOUTH|SLOPE.STEEP]: "dirt_24.png",

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


export class PixiIsometricTileMap {

    private chunks: { container: any, sprites: any[] }[] = [];
    public container: any;

    constructor(heightMap: HeightMap, tileTypeMap: TILE_TYPE[]) {
        this.container =  new PIXI.Container();
        this.initialize(heightMap, tileTypeMap);
    }

    private initialize(heightMap: HeightMap, tileTypeMap: TILE_TYPE[]) {

        const chunksX = heightMap.width / CHUNK_SIZE;
        const chunksY = heightMap.height / CHUNK_SIZE;

        for (let cy = 0; cy < Math.ceil(chunksY); ++cy) {
            for (let cx = 0; cx < Math.ceil(chunksX); ++cx) {
                const chunk_container = new PIXI.Container();

                const chunkPos = toIso(cx, cy, 0, TILE_WIDTH * (CHUNK_SIZE));
                // chunk_container.x = chunkPos[0];
                // chunk_container.y = chunkPos[1];

                const sprites: any[] = [];
                const chunk = { container: chunk_container, sprites: sprites };
                this.chunks.push(chunk);

                const sizeX = chunksX - cx >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksX - cx);
                const sizeY = chunksY - cy >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksY - cy);
                for (let y = 0; y < sizeY; ++y) {
                    for (let x = 0; x < sizeX; ++x) {
                        const texture = PIXI.utils.TextureCache[GRASS_TILEMAP[SLOPE.FLAT]];
                        if (texture) {
                            const sprite = new PIXI.Sprite(texture);
                            sprites.push(sprite);
                            sprite.anchor.x = 0.5;
                            sprite.anchor.y = 1;
                            const spritePos = toIso(x, y);
                            sprite.x = chunkPos[0] + spritePos[0];
                            sprite.y = chunkPos[1] + spritePos[1] + TILE_WIDTH * 0.5;
                            chunk_container.addChild(sprite);
                        }
                    }
                }
                this.container.addChild(chunk_container);
                // chunk_container.cacheAsBitmap = true;
            }
        }
    }

    update(heightMap: HeightMap, tileTypeMap: TILE_TYPE[]) {

        const chunksX = heightMap.width / CHUNK_SIZE;
        const chunksY = heightMap.height / CHUNK_SIZE;

        this.chunks.forEach((chunk, chunk_index) => {
            // chunk.container.cacheAsBitmap = false;
            const cx = chunk_index % Math.ceil(chunksX);
            const cy = Math.floor(chunk_index / Math.ceil(chunksY));
            const sizeX = chunksX - cx >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksX - cx);
            const sizeY = chunksY - cy >= 1 ? CHUNK_SIZE : CHUNK_SIZE * (chunksY - cy);
            const chunkPos = toIso(cx, cy, 0, TILE_WIDTH * (CHUNK_SIZE));
            chunk.sprites.forEach((sprite, sprite_index) => {
                const x = sprite_index % sizeX;
                const y = Math.floor(sprite_index / sizeX);
                const texture = PIXI.utils.TextureCache[this.getTextureAt(heightMap, tileTypeMap, cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y)];
                sprite.texture = texture || PIXI.Texture.EMPTY;
                const spritePos = toIso(x, y, this.getHeightAt(heightMap, cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y));
                sprite.y = chunkPos[1] + spritePos[1] + TILE_WIDTH * 0.5;
            });
            // chunk.container.cacheAsBitmap = true;
        });
    }

    get sprites(): any[] {
        const sprites: any[] = [];
        this.chunks.forEach((chunk) => {
            chunk.sprites.forEach((s) => sprites.push(s))
        });
        return sprites;
    }

    private getTextureAt(heightMap: HeightMap, tileTypeMap: TILE_TYPE[], x: number, y: number): string {
        const tileMap = this.getTileMap(tileTypeMap[y * heightMap.width + x]);
        
        return tileMap[this.getSlope(heightMap, x, y)];
    }

    private getSlope(heightMap: HeightMap, x: number, y: number): number {
        const height_min = this.getHeightAt(heightMap, x, y);
        const height_north = heightMap.getVertexHeight(x, y) - height_min;
        const height_east = heightMap.getVertexHeight(x+1, y) - height_min;
        const height_south = heightMap.getVertexHeight(x+1, y+1) - height_min;
        const height_west = heightMap.getVertexHeight(x, y+1) - height_min;

        const slope_north = height_north > 0 ? SLOPE.NORTH : 0;
        const slope_east = height_east > 0 ? SLOPE.EAST : 0;
        const slope_south = height_south > 0 ? SLOPE.SOUTH : 0;
        const slope_west = height_west > 0 ? SLOPE.WEST : 0;
        const slope_steep = height_north === 2 || height_east === 2 || height_south === 2 || height_west === 2 ? SLOPE.STEEP : 0;
        const cliff = height_north === CLIFF_HEIGHT || height_east === CLIFF_HEIGHT || height_south === CLIFF_HEIGHT || height_west === CLIFF_HEIGHT ? SLOPE.CLIFF : 0;

        return slope_north | slope_east | slope_south | slope_west | slope_steep | cliff;
    }

    private getTile(tileTypeMap: TILE_TYPE[], x: number, y: number): number {
        return 0;
    }

    private getHeightAt(heightMap: HeightMap, x: number, y: number): number {
        const north = heightMap.getVertexHeight(x, y);
        const east = heightMap.getVertexHeight(x+1, y);
        const south = heightMap.getVertexHeight(x+1, y+1);
        const west = heightMap.getVertexHeight(x, y+1);

        return Math.min(north, east, south, west);
    }

    private getTileMap(type: TILE_TYPE): any {
        if (type === TILE_TYPE.DIRT) {
            return DIRT_TILEMAP;
        }
        return GRASS_TILEMAP;
    }

}