import { Controller, Body, Get, Post } from 'tsoa';
import { Profession } from '@bokari/shared';
import { db } from '../common/db';

export class ProfessionsController extends Controller {
	@Get()
	public async getAllProfessions(): Promise<Profession[]> {
		const professions = await db.profession.findMany();

		return professions;
	}

	@Post()
	public async createProfession(@Body() profession: Profession): Promise<Profession> {
		const createdProfession = await db.profession.create({
			data: {
				name: profession.name
			}
		});

		return createdProfession;
	}
}
