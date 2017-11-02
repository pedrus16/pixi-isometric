export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Camera {

    get x(): number { return 0; }
    set x(x: number) {}

    get y(): number { return 0; }
    set y(y: number) {}

    get scale(): number { return 1; }
    set scale(scale: number) {}

    addSprites(sprites: Sprite[]): void {}

}

export class Sprite {

    protected _x: number = 0;
    protected _y: number = 0;
    protected _texture: string;
    
    constructor(texture: string, rectangle?: Rectangle) {
        this._texture = texture;
    }

    get texture(): string { return this._texture; }
    set texture(texture: string) { this._texture = texture; }

    get x(): number { return this._x; }
    set x(x: number) { this._x = x; }

    get y(): number { return this._y; }
    set y(y: number) { this._y = y; }

    get width(): number { return 0; }
    get height(): number { return 0; }

}

export interface Graphics {
	
    initialize(updateCallback: Function): void;

    load(file: string, callback?: Function): void;

    addSprite(sprite: Sprite): void;

    createSprite(texture: string, rectangle?: Rectangle): Sprite;

    addCamera(camera: Camera): void;

    createCamera(): Camera;

}