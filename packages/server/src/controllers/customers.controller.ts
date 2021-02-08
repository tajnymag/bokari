import { Body, Get, JsonController, Param, Post } from 'routing-controllers';
import { Customer, getRepository } from '@bokari/database';

@JsonController('/customers')
export class CustomersController {
	@Get()
	async getAllCustomers(): Promise<Customer[]> {
		const customers = await getRepository(Customer).find({
			relations: ['contacts', 'contacts.address']
		});

		return customers;
	}

	@Get('/:id')
	async getCustomerById(@Param('id') id: number): Promise<Customer> {
		const customer = await getRepository(Customer).findOneOrFail(id, {
			relations: ['contacts', 'contacts.address']
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
