export enum WHEEL_DIRECTION {
    UP,
    DOWN
}

export class Input {
	
    private _mouseDown: boolean;
    private _mouseX: number;
    private _mouseY: number;

    private _mouseWheelCallback: Function;

    private _keys: any;

	constructor() {

        this._keys = {};

        window.addEventListener('mousedown', (event) => {
            this._mouseDown = true;
        });

        window.addEventListener('mouseup', (event) => {
            this._mouseDown = false;
        });

        window.addEventListener('mousemove', (event) => {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
        });

        window.addEventListener('mousewheel', (event) => {
            if (this._mouseWheelCallback) {
                let direction;
                if (event.deltaY > 0) {
                    direction = WHEEL_DIRECTION.DOWN;
                }
                else if (event.deltaY < 0) {
                    direction = WHEEL_DIRECTION.UP;
                }
                this._mouseWheelCallback(direction);
            }
        });

        window.addEventListener('keydown', (event) => {
            this._keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this._keys[event.key] = false;
        });
    }

    get mouseDown(): boolean { return this._mouseDown; }
    get mouseX(): number { return this._mouseX; }
    get mouseY(): number { return this._mouseY; }

    onMouseWheel(callback: Function): void {
        this._mouseWheelCallback = callback;
    }

    isKeyDown(key: string): boolean {
        return this._keys[key] || false;
    }

}