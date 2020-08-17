import {Entity} from "./entity";

export interface Address extends Entity {
	city: string;
	street: string;
	state?: string;
	zip: string;
	country: string;
}
