import { TILE_WIDTH, LAYER_HEIGHT } from './Graphics/PixiIsometricTileMap';

export function toIso(x: number, y: number,  z: number = 0, width = TILE_WIDTH): [number, number] {
    const isoX = (x * 0.5 - y * 0.5) * width;
    const isoY = (y * 0.25 + x * 0.25) * width - z * LAYER_HEIGHT;
    return [isoX, isoY];
}