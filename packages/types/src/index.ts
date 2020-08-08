import {Length} from "class-validator";

export class User {
	@Length(0, 3)
	password!: string;
}
