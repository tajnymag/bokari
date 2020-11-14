import { Body, Controller, Get, Route, Post, SuccessResponse } from 'tsoa';
import { Business, BusinessInsertable } from '@bokari/shared';
import { BusinessWhereUniqueInput } from '@bokari/database';
import { Forbidden } from '@curveball/http-errors';
import { db } from '../common/db';

@Route('businesses')
export class BusinessesController extends Controller {
	@Get()
	public async getAllBusinesses(): Promise<Business[]> {
		const rawBusinesses = await db.business.findMany({
			include: {
				businessProfessions: {
					include: {
						profession: true
					}
				}
			}
		});

		return rawBusinesses.map((rb) => ({
			name: rb.name,
			registrationNumber: rb.registrationNumber,
			professions: rb.businessProfessions.map((bp) => ({ name: bp.profession.name }))
		}));
	}

	@SuccessResponse('201', 'Created')
	@Post()
	public async createBusiness(@Body() business: BusinessInsertable): Promise<Business> {
		const businessExists = await this.existsBusiness({
			name: business.name,
			registrationNumber: business.registrationNumber
		});

		if (businessExists) {
			throw new Forbidden('A business with such name and registration number already exists!');
		}

		const createdRawBusiness = await db.business.create({
			data: {
				name: business.name,
				registrationNumber: business.registrationNumber,
				businessProfessions: {
					create: business.professions.map((p) => ({ profession: { connect: { id: p.id } } }))
				}
			},
			include: {
				businessProfessions: {
					include: {
						profession: true
					}
				}
			}
		});

		return {
			name: createdRawBusiness.name,
			registrationNumber: createdRawBusiness.registrationNumber,
			professions: createdRawBusiness.businessProfessions.map((bp) => ({
				name: bp.profession.name
			}))
		};
	}

	public async existsBusiness(
		query: BusinessWhereUniqueInput & Pick<Partial<Business>, 'name' | 'registrationNumber'>
	): Promise<boolean> {
		const foundId = await db.business.findOne({ where: query, select: { id: true } });

		return foundId !== null;
	}
}
