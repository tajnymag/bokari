export interface BaseDataService {
	findOne: (query: never) => Promise<unknown | null>;
	findMany: (query: never) => Promise<unknown>;

	createOne: (data: never) => Promise<unknown>;

	updateOne: (data: never, query: never) => Promise<unknown>;

	deleteOne: (query: never) => Promise<unknown>;
}
