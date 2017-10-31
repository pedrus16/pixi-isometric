import { Graphics } from './Graphics';

export class Entity {

    private _id: number;
    private _x: number;
    private _y: number;
    private _graphics: Graphics;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    initialize(graphics: Graphics) {
        this.graphics = graphics;
    }

    update(dt: number): void {}

    set id(id: number) { this._id = id; }
    get id(): number { return this._id; }

    set graphics(graphics: Graphics) { this._graphics = graphics; }
    get graphics(): Graphics { return this._graphics; }

}

export default Entity;