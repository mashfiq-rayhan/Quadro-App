import { BookingDto, BookingInput } from "./booking.interface";
import { BookingType } from "@prisma/client";
import * as _ from "lodash";

export async function toBookingInput(payload: BookingDto): Promise<BookingInput> {
	console.log(_.includes({ a: 1, b: 2 }, 1));
	return {
		serviceId: payload.serviceId,
		bookingType: "APPOINTMENT",
		bookingTime: payload.bookingTime,
		note: payload.note,
	};
}
