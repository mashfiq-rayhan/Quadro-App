/* eslint-disable require-atomic-updates */
import { ErrorCodes } from "../../errors/ErrorCodes";
import servicesService from "../service/service/service.services";
import bookingDal from "./booking.dal";
import { BookingDto, BookingOutput } from "./booking.interface";
import * as bookingMapper from "./booking.mapper";
import { Booking } from ".prisma/client";

export async function createBooking(payload: BookingDto): Promise<BookingOutput> {
	const targetService = await servicesService.getServiceByTypeId(payload.serviceId);
	payload.serviceId = targetService.id;
	payload.bookingType = targetService.serviceType;
	const newBooking = await bookingDal.create(bookingMapper.toBookingInput(payload));
	return bookingMapper.toBookingOutput(newBooking);
}

async function getBookingbyId(id: number): Promise<BookingOutput> {
	const booking = await bookingDal.getById(id);
	return bookingMapper.toBookingOutput(booking);
}

async function updateBooking(id: number, payload: BookingDto): Promise<BookingOutput> {
	const updatedBooking = await bookingDal.update(id, bookingMapper.toBookingInput(payload));
	return bookingMapper.toBookingOutput(updatedBooking);
}

async function cancleBooking(orderId: number, userId: number): Promise<Booking> {
	const isAuthorized = await bookingDal.chekcAuthorization(orderId, userId);
	if (!isAuthorized) throw Error(ErrorCodes.Unauthorized + " Your Unauthorized for this action ");
	const bookingDetails = await bookingDal.getByOrderId(orderId);
	const cancledOrder = await bookingDal.cancelBooking(bookingDetails.id);
	return cancledOrder;
}

async function deleteBooking(id: number, userId: number): Promise<void> {
	const booking = await bookingDal.getByOrderId(id);
	const isAuthorized = await bookingDal.chekcAuthorization(id, userId);
	if (!isAuthorized) throw Error(ErrorCodes.Unauthorized + " Your Unauthorized for this action ");
	await bookingDal.deleteById(booking.id);
}

const bookingService = {
	createBooking,
	getBookingbyId,
	updateBooking,
	cancleBooking,
	deleteBooking,
};

export default bookingService;
