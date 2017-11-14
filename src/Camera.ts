import { Entity } from './Entity';
import { Input, WHEEL_DIRECTION } from './Input';
import { PixiGraphics } from './PixiGraphics';

export class Camera extends Entity { 

    private _graphics: PixiGraphics;
    private _input: Input;

    private _dragInitialPos = [0, 0];

    constructor(graphics: PixiGraphics, input: Input) {
        super(0, 0);
        this._graphics = graphics;
        this._input = input;

        this._input.onMouseWheel((direction: WHEEL_DIRECTION) => {
            if (direction === WHEEL_DIRECTION.UP) {
                this._graphics.camera.scale.x *= 2;
                this._graphics.camera.scale.y *= 2;
                this._x *= 2
                this._y *= 2
            }
            else {
                this._graphics.camera.scale.x *= 0.5;
                this._graphics.camera.scale.y *= 0.5;
                this._x *= 0.5;
                this._y *= 0.5;
            }
        });
    }

    initialize() {}

    update(dt: number) {
        if (this._input.mouseRightDown) {
            if (!this._dragInitialPos){
                this._dragInitialPos = [
                    this._input.mouseX + this._x, 
                    this._input.mouseY + this._y
                ];
            }
            this._x = this._dragInitialPos[0] - this._input.mouseX;
            this._y = this._dragInitialPos[1] - this._input.mouseY;
        }
        else {
            this._dragInitialPos = null;
        }
        this._graphics.camera.x = -this._x + this._graphics.app.screen.width * 0.5;
        this._graphics.camera.y = -this._y + this._graphics.app.screen.height * 0.5;
    }

    get x() { return this._x - this._graphics.app.screen.width * 0.5; }
    get y() { return this._y - this._graphics.app.screen.height * 0.5; }

    get scale() { return this._graphics.camera.scale.x; }

}