import { AppointmentInput, AppointmentDocument } from "./appointment.interfaces";
import { ErrorCodes } from "../../errors/ErrorCodes";
import prisma from "@providers/prisma.provider";
import { Prisma } from "@prisma/client";

export async function create(payload: AppointmentInput): Promise<AppointmentDocument> {
	const newAppointment = await prisma.appointment.create({
		data: {
			duration: payload.duration,
			paymentAcceptType: payload.paymentAcceptType,
			depositAmount: payload.depositAmount,
			service: {
				create: {
					name: payload.service.name,
					description: payload.service.description,
					location: payload.service.location,
					price: payload.service.price,
				},
			},
		},
		include: { service: true },
	});
	return newAppointment;
}

export async function getById(id: string): Promise<AppointmentDocument> {
	const targetAppointment = await prisma.appointment.findUnique({
		where: {
			id: id,
		},
		include: { service: true },
	});

	if (!targetAppointment) throw Error(ErrorCodes.NotFound);
	return targetAppointment;
}

export async function update(id: string, payload: AppointmentInput): Promise<AppointmentDocument> {
	const targetAppointment = await getById(id);

	if (!targetAppointment) throw Error(ErrorCodes.NotFound);

	const updatedAppointment = await prisma.appointment.update({
		where: {
			id: id,
		},
		data: {
			duration: payload.duration,
			paymentAcceptType: payload.paymentAcceptType,
			depositAmount: payload.depositAmount,
			service: {
				update: {
					name: payload.service.name,
					description: payload.service.description,
					location: payload.service.location,
					price: payload.service.price,
				},
			},
		},
		include: { service: true },
	});

	return updatedAppointment;
}

export async function getAll(): Promise<Array<AppointmentDocument>> {
	const appointmentsList = await prisma.appointment.findMany({ include: { service: true } });
	return appointmentsList;
}

export async function deleteById(id: string): Promise<void> {
	const targetAppointment = await getById(id);
	if (!targetAppointment) throw Error(ErrorCodes.NotFound);

	await prisma.appointment.delete({
		where: {
			id: id,
		},
	});
	await prisma.service.delete({
		where: {
			id: targetAppointment.service.id,
		},
	});
}

export async function getAppointment(
	filter: Prisma.AppointmentFindFirstArgs,
): Promise<Array<AppointmentDocument> | AppointmentDocument | any> {
	const targetAppointment = await prisma.appointment.findFirst(filter);
	if (!targetAppointment) return false;
	return targetAppointment;
}
