export abstract class Entity {

    protected _id: number;
    protected _x: number;
    protected _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    abstract initialize(): void;

    abstract update(dt: number): void;

    set id(id: number) { this._id = id; }
    get id(): number { return this._id; }

    get x(): number { return this._x; }
    get y(): number { return this._y; }

}

export default Entity;