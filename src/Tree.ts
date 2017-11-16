import { Entity } from './Entity';

import palmPNG from './palm01.png';

function toIso(x: number, y: number, width = 64): [number, number] {
    const isoX = (x * 0.5 - y * 0.5) * width;
    const isoY = (y * 0.25 + x * 0.25) * width;
    return [isoX, isoY];
}

export class Tree extends Entity {
	
	private _sprite: any;

	constructor(x: number, y: number, height: number) {
		super(x, y);

		const iso = toIso(x, y);
		const texture = PIXI.utils.TextureCache[palmPNG];
		this._sprite = new PIXI.Sprite(texture);
		this._sprite.anchor.x = 0.5;
		this._sprite.anchor.y = 0.8;
		this._sprite.x = iso[0];
		this._sprite.y = iso[1] - height;
	}

	initialize() {
	}

	update(dt: number) {

	}

	get sprite(): any { return this._sprite; }

}