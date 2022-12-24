import { Booking } from "@prisma/client";
import prisma from "@providers/prisma.provider";

import { ErrorCodes } from "../../errors/ErrorCodes";
import { BookingDocument, BookingInput } from "./booking.interface";

async function create(payload: BookingInput): Promise<BookingDocument> {
	const newBooking = await prisma.booking.create({
		data: {
			bookingTime: payload.bookingTime,
			bookingType: payload.bookingType,
			location: payload.location,
			note: payload.note,
			service: {
				connect: { id: payload.serviceId },
			},
		},
		include: { service: true },
	});
	return newBooking;
}

async function getById(id: number): Promise<BookingDocument> {
	const targetBooking = await prisma.booking.findUnique({
		where: {
			id: id,
		},
		include: { service: true },
	});

	if (!targetBooking) throw Error(ErrorCodes.NotFound);
	return targetBooking;
}

async function getByOrderId(id: number): Promise<BookingDocument> {
	const targetBooking = await prisma.booking.findFirst({
		where: {
			order: {
				id: id,
			},
		},
		include: { service: true },
	});

	if (!targetBooking) throw Error(ErrorCodes.NotFound);
	return targetBooking;
}

async function update(id: number, payload: BookingInput): Promise<BookingDocument> {
	const targetBooking = await getById(id);

	if (!targetBooking) throw Error(ErrorCodes.NotFound);

	const updatedBooking = await prisma.booking.update({
		where: {
			id: id,
		},
		data: {
			bookingTime: payload.bookingTime,
			note: payload.note,
		},
		include: { service: true },
	});

	return updatedBooking;
}

async function chekcAuthorization(id: number, userId: number): Promise<boolean> {
	const isAuthorized = await prisma.booking.findFirst({
		where: {
			OR: [
				{ id },
				{
					order: {
						AND: [{ id: id }, { OR: [{ clientId: userId }, { business: { user: { id: userId } } }] }],
					},
				},
			],
		},
	});
	if (!isAuthorized) return false;
	return true;
}

async function cancelBooking(id: number): Promise<Booking> {
	const cancledBooking = await prisma.booking.update({
		where: {
			id: id,
		},
		data: {
			active: false,
		},
	});
	return cancledBooking;
}

async function getAll(): Promise<Array<BookingDocument>> {
	const BookingsList = await prisma.booking.findMany({ include: { service: true } });
	return BookingsList;
}

async function deleteById(id: number): Promise<void> {
	await prisma.booking.delete({
		where: {
			id: id,
		},
	});

	await prisma.booking.update({
		where: {
			id,
		},
		data: {
			order: {
				delete: true,
			},
		},
	});
}

const bookingDal = {
	create,
	getById,
	update,
	getAll,
	deleteById,
	chekcAuthorization,
	getByOrderId,
	cancelBooking,
};

export default bookingDal;
