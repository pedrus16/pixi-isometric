import { Entity } from './Entity';
import { Graphics } from './Graphics';
import { Terrain } from './Terrain';

export class Player extends Entity {

	constructor(x: number, y: number, graphics: Graphics, world: Terrain) {
		super(x, y, graphics);
	}

}

export default Player;