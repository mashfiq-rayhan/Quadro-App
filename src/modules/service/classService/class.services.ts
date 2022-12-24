import log from "@providers/logger.provider";

import classDal from "./class.dal";
import { ClassDocument, ClassOutput, ClassServiceDto } from "./class.interfaces";
import classMapper from "./class.mapper";

export async function createClass(payload: ClassServiceDto): Promise<ClassOutput> {
	log.info("Creating New Class");
	const newClass = await classDal.create(classMapper.toClassInput(payload));
	if (!newClass) throw Error("Failed Creating Class");
	return classMapper.toClassOutput(newClass);
}

export async function updateClass(id: number, payload: ClassServiceDto): Promise<ClassOutput> {
	log.info("Updating Class Info");
	const updatedClass = await classDal.update(id, classMapper.toClassInput(payload));
	return classMapper.toClassOutput(updatedClass);
}

export async function getClassById(id: number): Promise<ClassOutput> {
	log.info("Getting Single Class ");

	try {
		const targerClass = await classDal.getById(id);
		return classMapper.toClassOutput(targerClass);
	} catch (error) {
		log.error(`Getting Class Failed Error => ${error} `);
		throw error;
	}
}

export async function getClassServiceId(id: number): Promise<number> {
	const targerClass = await classDal.getById(id);
	return targerClass.serviceId;
}

export async function getAllClasss(): Promise<Array<ClassOutput>> {
	const ClasssList: Array<ClassDocument> = await classDal.getAll();
	const populatedClasssList: Array<ClassOutput> = [];

	for (const iterator of ClasssList) {
		populatedClasssList.push(classMapper.toClassOutput(iterator));
	}

	return populatedClasssList;
}

export async function getAllClasssByUser(userId: number, businessId: number): Promise<Array<ClassOutput>> {
	const classsList: Array<ClassDocument> = await classDal.getAllbyFilter({
		where: {
			service: {
				business: {
					AND: [
						{
							user: {
								id: userId,
							},
						},
						{
							id: businessId,
						},
					],
				},
			},
		},
	});

	return mapList(classsList);
}

export async function getAllClasssByBusiness(businessId: number): Promise<Array<ClassOutput>> {
	const classsList: Array<ClassDocument> = await classDal.getAllbyFilter({
		where: {
			AND: [{ service: { businessId: businessId } }, { published: true }],
		},
	});
	return mapList(classsList);
}

export async function deleteClass(id: number): Promise<void> {
	await classDal.deleteById(id);
}

function mapList(classsList: Array<ClassDocument>): Array<ClassOutput> {
	const mappedClasssList: Array<ClassOutput> = [];
	for (const iterator of classsList) {
		mappedClasssList.push(classMapper.toClassOutput(iterator));
	}
	return mappedClasssList;
}

const classService = {
	createClass,
	updateClass,
	getClassById,
	getAllClasss,
	getAllClasssByUser,
	getAllClasssByBusiness,
	deleteClass,
	getClassServiceId,
};

export default classService;
