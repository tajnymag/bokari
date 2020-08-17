import {Person} from "./person";
import {Business} from "./business";
import {Entity} from "./entity";

export interface Contractor extends Person, Entity {
	business: Business;
}
