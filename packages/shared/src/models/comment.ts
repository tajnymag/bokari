import {User} from "./user";
import {Entity} from "./entity";

export interface Comment extends Entity {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	author: User;
}
