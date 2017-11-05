import { Graphics, Renderable } from './Graphics';

export class Entity {

    protected _id: number;
    protected _x: number;
    protected _y: number;
    protected _graphics: Graphics;

    constructor(x: number = 0, y: number = 0, graphics: Graphics) {
        this._x = x;
        this._y = y;
        this._graphics = graphics;
    }

    initialize() {}

    update(dt: number): void {}

    set id(id: number) { this._id = id; }
    get id(): number { return this._id; }

    set graphics(graphics: Graphics) { this._graphics = graphics; }
    get graphics(): Graphics { return this._graphics; }

}

export default Entity;