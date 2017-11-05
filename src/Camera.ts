import { Entity } from './Entity';
import { Container, Graphics, Sprite } from './Graphics';

export class Camera extends Entity {

	private _container: Container;
	private _width: number;
	private _height: number;
	private _zoom: number;
	private _callback: Function;

	constructor(x: number, y: number, width: number, height: number, graphics: Graphics) {
		super(x, y, graphics);
		this._width = width;
		this._height = height;
		this._container = graphics.createContainer();
		this._container.x = -this._x + this._width * 0.5;
		this._container.y = -this._y + this._height * 0.5;
		this._zoom = 1;
	}

	get container(): Container { return this._container; }

	get zoom(): number { return this._zoom; }
	set zoom(zoom: number) { 
		this._zoom = zoom;
		this._container.scale = zoom;
		this.emitBoundariesUpdate();
	}

	get x(): number { return this._x; }
	set x(x: number) {
		this._x = x;
		this._container.x = -this._x + (this._width * 0.5);
		this.emitBoundariesUpdate();
	}

	get y(): number { return this._y; }
	set y(y: number) {
		this._y = y;
		this._container.y = -this._y + (this._height * 0.5);
		this.emitBoundariesUpdate();
	}

	get width(): number { return this._width; }
	get height(): number { return this._height; }

	get boundaries(): { left: number, top: number, right: number, bottom: number } {
		return {
			left: (this._x - this.width * 0.5) / this._zoom,
			top: (this._y - this.height * 0.5) / this._zoom,
			right: (this._x + this.width * 0.5) / this._zoom,
			bottom: (this._y + this.width * 0.5) / this._zoom
		};
	}

	add(element: Container | Sprite) {
		this._container.add(element);
	}

	onBoundariesUpdate(callback: Function) {
		this._callback = callback;
	}

	private emitBoundariesUpdate() {
		if ( this._callback) { this._callback(); }
	}

}

export default Camera;