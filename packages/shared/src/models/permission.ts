/**
 * @tsoaModel
 */
export enum Permission {
	USERS_READ = 1,
	USERS_WRITE = 2,
	FINANCES_READ = 4,
	FINANCES_WRITE = 8,
	CONTRACTS_READ = 16,
	CONTRACTS_WRITE = 32
}
