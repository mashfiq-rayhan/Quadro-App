import * as servicesService from "../serviceInformation/service.services";
import log from "@providers/logger.provider";
import { ClassOutput, ClassDto, ClassDocument, ClassID } from "./class.interfaces";
import { ServiceOutput } from "../serviceInformation/service.interface";
import * as classMapper from "./class.mapper";
import * as classDal from "./class.dal";
import { CreateClassDto } from "./class.schema";

export async function createClass(payload: ClassDto): Promise<ClassOutput> {
	const newService: ServiceOutput = await servicesService.createService(payload);
	const newClass: ClassDocument = await classDal.create(
		classMapper.toClassInput({ ...payload, serviceId: newService._id }),
	);
	if (!newClass) throw Error("Failed Creating Class"); // TODO Throw a fallback to service
	return classMapper.toClassOutput(newClass, newService);
}

export async function updateClass(id: string, payload: ClassDto): Promise<ClassOutput> {
	const updatedClass = await classDal.update(id, classMapper.toClassInput(payload));
	log.info("Class Updated ---- Updating Service Info");
	const updatedService = await servicesService.updateService(updatedClass.serviceId, payload);

	return classMapper.toClassOutput(updatedClass, updatedService);
}

export async function getClassById(id: ClassID): Promise<ClassOutput> {
	try {
		const targerClass = await classDal.getById(id);
		return await populateWithServiceInformation(targerClass);
	} catch (error) {
		log.error(`Getting Class Failed Error => ${error} `);
		throw error;
	}
}

export async function getAllClasss(): Promise<Array<ClassOutput>> {
	const ClasssList: Array<ClassDocument> = await classDal.getAll();
	const populatedClasssList: Array<ClassOutput> = [];

	for await (const iterator of ClasssList) {
		const populatedClass = await populateWithServiceInformation(iterator);
		populatedClasssList.push(populatedClass);
	}

	return populatedClasssList;
}

export async function deleteClass(id: ClassID): Promise<void> {
	const targetClass = await classDal.getById(id);
	await classDal.deleteById(targetClass._id);
	await servicesService.deleteServiceById(targetClass.serviceId);
}

async function populateWithServiceInformation(payload: ClassDocument): Promise<ClassOutput> {
	const targerService = await servicesService.getServiceById(String(payload.serviceId));
	return classMapper.toClassOutput(payload, targerService);
}
