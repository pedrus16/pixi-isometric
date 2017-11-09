export class Entity {

    protected _id: number;
    protected _x: number;
    protected _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    initialize() {}

    update(dt: number): void {}

    set id(id: number) { this._id = id; }
    get id(): number { return this._id; }

}

export default Entity;