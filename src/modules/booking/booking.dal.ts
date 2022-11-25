import { BookingInput, BookingDocument } from "./booking.interface";
import { ErrorCodes } from "../../errors/ErrorCodes";
import prisma from "@providers/prisma.provider";

export async function create(payload: BookingInput): Promise<BookingDocument> {
	const newBooking = await prisma.booking.create({
		data: {
			bookingTime: payload.bookingTime,
			bookingType: payload.bookingType,
			note: payload.note,
			service: {
				connect: { id: payload.serviceId },
			},
		},
		include: { service: true },
	});
	return newBooking;
}

export async function getById(id: string): Promise<BookingDocument> {
	const targetBooking = await prisma.booking.findUnique({
		where: {
			id: id,
		},
		include: { service: true },
	});

	if (!targetBooking) throw Error(ErrorCodes.NotFound);
	return targetBooking;
}

export async function update(id: string, payload: BookingInput): Promise<BookingDocument> {
	const targetBooking = await getById(id);

	if (!targetBooking) throw Error(ErrorCodes.NotFound);

	const updatedBooking = await prisma.booking.update({
		where: {
			id: id,
		},
		data: {
			bookingTime: payload.bookingTime,
			bookingType: payload.bookingType,
			note: payload.note,
		},
		include: { service: true },
	});

	return updatedBooking;
}

export async function getAll(): Promise<Array<BookingDocument>> {
	const BookingsList = await prisma.booking.findMany({ include: { service: true } });
	return BookingsList;
}

export async function deleteById(id: string): Promise<void> {
	const targetBooking = await getById(id);
	if (!targetBooking) throw Error(ErrorCodes.NotFound);

	await prisma.booking.delete({
		where: {
			id: id,
		},
	});
	await prisma.service.delete({
		where: {
			id: targetBooking.service.id,
		},
	});
}
