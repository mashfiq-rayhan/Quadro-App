import { ServiceType } from "@prisma/client";

import { BookingDocument, BookingDto, BookingInput, BookingOutput } from "./booking.interface";

export function toBookingInput(payload: BookingDto): BookingInput {
	return {
		serviceId: payload.serviceId ? payload.serviceId : "",
		bookingType: payload.bookingType ? ServiceType[payload.bookingType] : "",
		bookingTime: payload.bookingTime ? new Date(payload.bookingTime) : null,
		note: payload.note ? payload.note : "",
	};
}

export function toBookingOutput(payload: BookingDocument): BookingOutput {
	return {
		service: {
			...payload.service,
		},
		id: payload.id,
		bookingTime: payload.bookingTime,
		bookingType: payload.bookingType,
		note: payload.note,
	};
}
