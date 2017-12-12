export const CLIFF_HEIGHT = 6;

export enum SLOPE {
    FLAT = 0b000000,
    NORTH = 0b001000,
    EAST = 0b000100,
    SOUTH = 0b000010,
    WEST = 0b000001,
    STEEP = 0b010000,
    CLIFF = 0b100000,
};

import { Command } from './Command';

export class SetVertexHeightCommand extends Command {

    private _heightmap: HeightMap;
    private _x: number;
    private _y: number;
    private _height: number;

    private _prev_height: number;

    constructor(heightmap: HeightMap, x: number, y: number, height: number) {
        super();
        this._heightmap = heightmap;
        this._x = x;
        this._y = y;
        this._height = height;
    }

    execute() {
        this._prev_height = this._heightmap.getVertexHeight(this._x, this._y);
        this._heightmap.setVertexHeight(this._x, this._y, this._height);
    }

    undo() {
        this._heightmap.setVertexHeight(this._x, this._y, this._prev_height);
    }

}

export class HeightMap {

    private _heightMap: number[];
    
    private _width: number;
    private _height: number;

    private _commands: Command[][] = [];
    private _current: number = 0;

    constructor(width: number, height: number) {
        this._width = width + 1;
        this._height = height + 1;

        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) { this._heightMap.push(0); }
    }

    get width(): number { return this._width - 1; }
    get height(): number { return this._height - 1; }
    get heightMap(): number[] { return this._heightMap; }

    getHeightAt(x: number, y: number): number {
        const minX = Math.floor(x);
        const maxX = Math.floor(x + 1);
        const minY = Math.floor(y);
        const maxY = Math.floor(y + 1);
        const top_left = this.getVertexHeight(Math.floor(x), Math.floor(y));
        const top_right = this.getVertexHeight(Math.ceil(x), Math.floor(y));
        const bottom_left = this.getVertexHeight(Math.floor(x), Math.ceil(y));
        const bottom_right = this.getVertexHeight(Math.ceil(x), Math.ceil(y));

        const y1 = ((maxX - x) / (maxX - minX)) * top_left + ((x - minX) / (maxX - minX)) * top_right;
        const y2 = ((maxX - x) / (maxX - minX)) * bottom_left + ((x - minX) / (maxX - minX)) * bottom_right;

        const result = ((maxY - y) / (maxY - minY)) * y1 + ((y - minY) / (maxY - minY)) * y2;
        return result;
    }

    getTileHeight(x: number, y: number): number {
        const north = this.getVertexHeight(x, y);
        const east = this.getVertexHeight(x + 1, y);
        const south = this.getVertexHeight(x + 1, y + 1);
        const west = this.getVertexHeight(x, y + 1);

        return Math.min(north, east, south, west);
    } 

    getVertexHeight(x: number, y: number) {
        x = Math.max(0, Math.min(x, this._width - 1));
        y = Math.max(0, Math.min(y, this._height - 1));
        return this._heightMap[y * this._width + x];
    }

    setVertexHeight(x: number, y: number, height: number) {
        this._heightMap[y * this._width + x] = height;
    }

    raiseTile(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        const height_nw = this.getVertexHeight(x, y);
        const height_ne = this.getVertexHeight(x + 1, y);
        const height_se = this.getVertexHeight(x + 1, y + 1);
        const height_sw = this.getVertexHeight(x, y + 1);

        const commands = [
            ...this.setVertexHeightSafe(x, y, height_nw + 1),
            ...this.setVertexHeightSafe(x + 1, y, height_ne + 1),
            ...this.setVertexHeightSafe(x + 1, y + 1, height_se + 1),
            ...this.setVertexHeightSafe(x, y + 1, height_sw + 1),
        ];
        if (commands.length) { 
            this._commands.splice(this._current + 1);
            this._commands.push(commands); 
            this._current = this._commands.length - 1; 
        }

    }

    lowerTile(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }
        const height_nw = this.getVertexHeight(x, y);
        const height_ne = this.getVertexHeight(x + 1, y);
        const height_se = this.getVertexHeight(x + 1, y + 1);
        const height_sw = this.getVertexHeight(x, y + 1);

        const commands = [
            ...this.setVertexHeightSafe(x, y, height_nw - 1),
            ...this.setVertexHeightSafe(x + 1, y, height_ne - 1),
            ...this.setVertexHeightSafe(x + 1, y + 1, height_se - 1),
            ...this.setVertexHeightSafe(x, y + 1, height_sw - 1),
        ];
        if (commands.length) {
            this._commands.splice(this._current + 1);
            this._commands.push(commands); 
            this._current = this._commands.length - 1;
        }
    }

    levelTile(x: number, y: number, height: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const commands = [
            ...this.setVertexHeightSafe(x, y, height),
            ...this.setVertexHeightSafe(x + 1, y, height),
            ...this.setVertexHeightSafe(x + 1, y + 1, height),
            ...this.setVertexHeightSafe(x, y + 1, height),
        ];
        if (commands.length) {
            this._commands.splice(this._current + 1);
            this._commands.push(commands);
            this._current = this._commands.length - 1;
        }
    }

    setCliffHeight(tileX: number, tileY: number, step = 0) {
        if (tileX < 0 || tileY < 0 || tileX >= this._width - 1 || tileY >= this._height - 1) { return; }
        const baseHeight = this.getVertexHeight(tileX, tileY);
        if (baseHeight % CLIFF_HEIGHT) { return; }
        for (let y = tileY - 1; y < tileY + 3; ++y) {
            for (let x = tileX - 1; x < tileX + 3; ++x) {
                if (this.getVertexHeight(x, y) !== step * CLIFF_HEIGHT && this.getVertexHeight(x, y) !== (step - 1) * CLIFF_HEIGHT && this.getVertexHeight(x, y) !== (step + 1) * CLIFF_HEIGHT) {
                    return;
                }
            }
        }
        this.setTileHeight(tileX, tileY, CLIFF_HEIGHT * step);
    }

    getSlope(x: number, y: number): number {
        const height_min = this.getTileHeight(x, y);
        const height_north = this.getVertexHeight(x, y) - height_min;
        const height_east = this.getVertexHeight(x+1, y) - height_min;
        const height_south = this.getVertexHeight(x+1, y+1) - height_min;
        const height_west = this.getVertexHeight(x, y+1) - height_min;

        const slope_north = height_north > 0 ? SLOPE.NORTH : 0;
        const slope_east = height_east > 0 ? SLOPE.EAST : 0;
        const slope_south = height_south > 0 ? SLOPE.SOUTH : 0;
        const slope_west = height_west > 0 ? SLOPE.WEST : 0;
        const slope_steep = height_north === 2 || height_east === 2 || height_south === 2 || height_west === 2 ? SLOPE.STEEP : 0;
        const cliff = height_north === CLIFF_HEIGHT || height_east === CLIFF_HEIGHT || height_south === CLIFF_HEIGHT || height_west === CLIFF_HEIGHT ? SLOPE.CLIFF : 0;

        return slope_north | slope_east | slope_south | slope_west | slope_steep | cliff;
    }

    undo() {
        if (this._current < 0) { return; }
        const current = this._commands[this._current];
        this._current = this._current - 1;
        if (current) {
            for (let i = current.length - 1; i >= 0; --i) {
                current[i].undo();
            }
        }
    }

    redo() {
        if (this._current >= this._commands.length - 1) { return; }
        this._current = this._current + 1;
        const next = this._commands[this._current];
        if (next) {
            next.forEach((command) => command.execute());
        }
    }

    private setVertexHeightSafe(x: number, y: number, height: number, step = 1): Command[] {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return; }
        
        const center = this.getVertexHeight(x, y);
        if (center === height ) { return []; }

        let north = this.getVertexHeight(x, y - 1);
        let east = this.getVertexHeight(x + 1, y);
        let south = this.getVertexHeight(x, y + 1);
        let west = this.getVertexHeight(x - 1, y);

        const north_east = this.getVertexHeight(x + 1, y - 1);
        const north_west = this.getVertexHeight(x - 1, y - 1);
        const south_east = this.getVertexHeight(x + 1, y + 1);
        const south_west = this.getVertexHeight(x - 1, y + 1);

        if (center % CLIFF_HEIGHT === 0 && (Math.abs(north - center) ===  CLIFF_HEIGHT || 
                                            Math.abs(east - center) ===  CLIFF_HEIGHT || 
                                            Math.abs(south - center) ===  CLIFF_HEIGHT || 
                                            Math.abs(west - center) ===  CLIFF_HEIGHT ||
                                            Math.abs(north_east - center) ===  CLIFF_HEIGHT ||
                                            Math.abs(north_west - center) ===  CLIFF_HEIGHT || 
                                            Math.abs(south_east - center) ===  CLIFF_HEIGHT || 
                                            Math.abs(south_west - center) ===  CLIFF_HEIGHT)) {
            return [];
        }

        let canChange = true;
        const commands: Command[] = [];
        if (north - height > step) {
            const c = this.setVertexHeightSafe(x, y - 1, height + step);
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        else if (north - height < -step) {
            const c = this.setVertexHeightSafe(x, y - 1, height - step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        if (east - height > step) {
            const c = this.setVertexHeightSafe(x + 1, y, height + step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        else if (east - height < -step) {
            const c = this.setVertexHeightSafe(x + 1, y, height - step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        if (south - height > step) {
            const c = this.setVertexHeightSafe(x, y + 1, height + step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        else if (south - height < -step) {
            const c = this.setVertexHeightSafe(x, y + 1, height - step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        if (west - height > step) {
            const c = this.setVertexHeightSafe(x - 1, y, height + step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        else if (west - height < -step) {
            const c = this.setVertexHeightSafe(x - 1, y, height - step)
            canChange = canChange && c.length > 0;
            commands.push(...c);
        }
        if (canChange) {
            const command = new SetVertexHeightCommand(this, x, y, height);
            command.execute();
            commands.push(command);
            return commands;
        }
        return [];
    }

    private generateHeightMap(t: number = 0) {
        const rate = 16;
        const rate2 = 16;
        
        this._heightMap = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            const x = i % this._width;
            const y = Math.floor(i / this._width);
            const z = Math.floor(Math.sin((x + t * 0.25) / rate) * rate) - Math.floor(Math.sin((y + t) / rate2) * rate2);// - Math.floor(Math.sin((x + t1 * 0.5) / 16));
            this._heightMap.push(z);
        }
    }

    private setTileHeight(x: number, y: number, height: number) {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height - 1) { return; }

        const commands = [
            new SetVertexHeightCommand(this, x, y, height),
            new SetVertexHeightCommand(this, x + 1, y, height),
            new SetVertexHeightCommand(this, x + 1, y + 1, height),
            new SetVertexHeightCommand(this, x, y + 1, height),
        ];
        commands.forEach((command) => command.execute());
        this._commands.push(commands);

    }

}