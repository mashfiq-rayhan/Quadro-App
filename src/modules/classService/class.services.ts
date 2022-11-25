import log from "@providers/logger.provider";
import { ClassOutput, ClassDto, ClassDocument } from "./class.interfaces";
import * as classMapper from "./class.mapper";
import * as classDal from "./class.dal";

export async function createClass(payload: ClassDto): Promise<ClassOutput> {
	log.info("Creating New Class");
	const newClass = await classDal.create(classMapper.toClassInput({ ...payload }));
	if (!newClass) throw Error("Failed Creating Class");
	return classMapper.toClassOutput(newClass);
}

export async function updateClass(id: string, payload: ClassDto): Promise<ClassOutput> {
	log.info("Updating Class Info");
	const updatedClass = await classDal.update(id, classMapper.toClassInput(payload));
	return classMapper.toClassOutput(updatedClass);
}

export async function getClassById(id: string): Promise<ClassOutput> {
	log.info("Getting Single Class ");

	try {
		const targerClass = await classDal.getById(id);
		return classMapper.toClassOutput(targerClass);
	} catch (error) {
		log.error(`Getting Class Failed Error => ${error} `);
		throw error;
	}
}

export async function getAllClasss(): Promise<Array<ClassOutput>> {
	const ClasssList: Array<ClassDocument> = await classDal.getAll();
	const populatedClasssList: Array<ClassOutput> = [];

	for (const iterator of ClasssList) {
		populatedClasssList.push(classMapper.toClassOutput(iterator));
	}

	return populatedClasssList;
}

export async function deleteClass(id: string): Promise<void> {
	await classDal.deleteById(id);
}
