import { Address } from "./address";
import {Entity} from "./entity";

export interface Contact extends Entity {
	email?: string;
	phone?: string;
	note?: string;
	address?: Address;
}
