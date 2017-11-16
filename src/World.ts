import { Map } from './Map';
import { Entity } from './Entity';

export class World {

    private _map: Map;
    private _entities: Entity[] = [];

    constructor(map: Map) {
        this._map = map;
    }

    update(dt: number) {
        this._entities.forEach((entity) => entity.update(dt));
    }
	
}