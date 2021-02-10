import { Authorized, Body, Get, JsonController, Param, Post } from 'routing-controllers';
import { Customer, getRepository } from '@bokari/database';

@Authorized()
@JsonController('/customers')
export class CustomersController {
	@Get()
	async getAllCustomers(): Promise<Customer[]> {
		const customers = await getRepository(Customer).find({
			relations: ['person', 'person.contacts']
		});

		return customers;
	}

	@Get('/:id')
	async getCustomerById(@Param('id') id: number): Promise<Customer> {
		const customer = await getRepository(Customer).findOneOrFail(id, {
			relations: ['person', 'person.contacts']
		});

		return customer;
	}

	@Post()
	async createCustomer(@Body() desiredCustomer: Customer): Promise<Customer> {
		const customerEntity = new Customer();
		customerEntity.person = desiredCustomer.person;

		const createdCustomer = await getRepository(Customer).save(customerEntity);

		return createdCustomer;
	}
}
