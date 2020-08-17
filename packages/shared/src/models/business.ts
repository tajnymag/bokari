import {Entity} from "./entity";
import {Profession} from "./profession";

export interface Business extends Entity {
	name: string;
	registrationNumber: string;
	professions: Profession[];
}
