import { Entity } from './Entity';
import { toIso } from './utils';
import { Input } from './Input';
import { Map } from './Map';

import manPNG from './Graphics/man.png';


export class Man extends Entity {
	
	private _sprite: any;
	private _input: Input;
	private _map: Map;

	constructor(x: number, y: number, z: number, input: Input, map: Map) {
		super(x, y, z);

		const iso = toIso(x, y, z);
		const texture = PIXI.utils.TextureCache[manPNG];
		const man = new PIXI.Sprite(texture);
		man.anchor.x = 0.5;
		man.anchor.y = 1;
		this._sprite = new PIXI.Container();
		this._sprite.addChild(man);
		this._sprite.x = iso[0];
		this._sprite.y = iso[1];
		this._sprite.z = z;
		this._input = input;
		this._map = map;
	}

	initialize() {}

	update(dt: number) {
		let moveX = 0;
		let moveY = 0;
		if (this._input.isKeyDown('w')) {
			moveX -= 1;
			moveY -= 1;
		}
		if (this._input.isKeyDown('a')) {
			moveX -= 1;
			moveY += 1;
		}
		if (this._input.isKeyDown('s')) {
			moveX += 1;
			moveY += 1;
		}
		if (this._input.isKeyDown('d')) {
			moveX += 1;
			moveY -= 1;
		}
		this.x += moveX * (dt / 1000) * 50;
		this.y += moveY * (dt / 1000) * 50;
		this.z = this._map.heightMap.getHeightAt(this.x, this.y);
	}

	destroy() {
		this._sprite.destroy();
	}

	get sprite(): any { return this._sprite; }

	get x() { return this._x; }
	set x(worldX: number) {
		this._x = worldX;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.x = iso[0];
		this._sprite.y = iso[1];
	}
	get y() { return this._y; }
	set y(worldY: number) {
		this._y = worldY;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.x = iso[0];
		this._sprite.y = iso[1];
	}
	get z() { return this._z; }
	set z(worldZ: number) {
		this._z = worldZ;
		const iso = toIso(this._x, this._y, this._z);
		this._sprite.y = iso[1];
	}

}