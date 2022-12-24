import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

import { ErrorCodes } from "../../../errors/ErrorCodes";
import { ClassDocument, ClassInput } from "./class.interfaces";

async function create(payload: ClassInput): Promise<ClassDocument> {
	const newAppointment = await prisma.class.create({
		data: {
			maxNumberOfParticipants: payload.maxNumberOfParticipants,
			duration: payload.duration,
			published: payload.published,
			startDateAndTime: payload.startDateAndTime,
			endDate: payload.endDate,
			service: {
				create: {
					name: payload.service.name,
					description: payload.service.description,
					location: payload.service.location,
					price: payload.service.price,
					business: { connect: { id: payload.service.businessId } },
					serviceType: payload.service.serviceType,
				},
			},
			repeat: {
				create: payload.repeat,
			},
		},
		include: { service: true, repeat: true },
	});
	console.log("In DAL :: return => ", newAppointment);
	return newAppointment;
}

async function getById(id: number): Promise<ClassDocument> {
	const targetClass = await prisma.class.findUnique({
		where: {
			id: id,
		},
		include: { service: true, repeat: true },
	});
	if (!targetClass) throw Error(ErrorCodes.NotFound + `No Class Found with Id : ${id}`);
	return targetClass;
}

async function update(id: number, payload: ClassInput): Promise<ClassDocument> {
	const targetClass = await getById(id);

	const updatedClass = await prisma.class.update({
		where: {
			id: targetClass.id,
		},
		data: {
			maxNumberOfParticipants: payload.maxNumberOfParticipants,
			duration: payload.duration,
			published: payload.published,
			startDateAndTime: payload.startDateAndTime,
			endDate: payload.endDate,
			service: {
				update: payload.service,
			},
			repeat: {
				update: payload.repeat,
			},
		},
		include: { service: true, repeat: true },
	});
	return updatedClass;
}

async function getAll(): Promise<Array<ClassDocument>> {
	const classList = await prisma.class.findMany({ include: { service: true, repeat: true } });
	return classList;
}

async function getAllbyFilter(filter: Prisma.ClassFindManyArgs): Promise<Array<ClassDocument>> {
	const classList = await prisma.class.findMany({ ...filter, include: { service: true, repeat: true } });
	return classList;
}

async function deleteById(id: number): Promise<void> {
	const targetClass = await getById(id);

	await prisma.class.delete({
		where: {
			id: id,
		},
	});
	await prisma.service.delete({
		where: {
			id: targetClass.service.id,
		},
	});
}

const classDal = {
	create,
	getById,
	update,
	getAll,
	getAllbyFilter,
	deleteById,
};

export default classDal;
