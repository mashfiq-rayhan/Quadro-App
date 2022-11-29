import { ClassInput, ClassDocument } from "./class.interfaces";
import { ErrorCodes } from "../../errors/ErrorCodes";
import prisma from "@providers/prisma.provider";
import { Prisma } from "@prisma/client";

export async function create(payload: ClassInput): Promise<ClassDocument> {
	// const newClass = await ClassModel.create(payload);
	// return newClass;
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
				},
			},
			repeat: {
				create: payload.repeat,
			},
			business: { connect: { id: payload.businessId } },
		},
		include: { service: true, repeat: true },
	});
	console.log("In DAL :: return => ", newAppointment);
	return newAppointment;
}

export async function getById(id: string): Promise<ClassDocument> {
	const targetClass = await prisma.class.findUnique({
		where: {
			id: id,
		},
		include: { service: true, repeat: true },
	});
	if (!targetClass) throw Error(ErrorCodes.NotFound);
	return targetClass;
}

export async function update(id: string, payload: ClassInput): Promise<ClassDocument> {
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

export async function getAll(): Promise<Array<ClassDocument>> {
	const classList = await prisma.class.findMany({ include: { service: true, repeat: true } });
	return classList;
}

export async function getAllbyFilter(filter: Prisma.ClassFindManyArgs): Promise<Array<ClassDocument>> {
	const classList = await prisma.class.findMany({ ...filter, include: { service: true, repeat: true } });
	return classList;
}

export async function deleteById(id: string): Promise<void> {
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
