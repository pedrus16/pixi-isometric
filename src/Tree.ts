import { Entity } from './Entity';
import { toIso } from './utils';

import palmPNG from './palm01.png';


export class Tree extends Entity {
	
	private _sprite: any;

	constructor(x: number, y: number, z: number) {
		super(x, y);

		const iso = toIso(x, y, z);
		const texture = PIXI.utils.TextureCache[palmPNG];
		this._sprite = new PIXI.Sprite(texture);
		this._sprite.anchor.x = 0.5;
		this._sprite.anchor.y = 0.8;
		this._sprite.x = iso[0];
		this._sprite.y = iso[1];
	}

	initialize() {
	}

	update(dt: number) {

	}

	get sprite(): any { return this._sprite; }

	set x(worldX: number) {
		this._x = worldX;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.x = iso[0];
	}
	set y(worldY: number) {
		this._y = worldY;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.y = iso[1];
	}
	set z(worldZ: number) {
		this._z = worldZ;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.y = iso[1];
	}

}