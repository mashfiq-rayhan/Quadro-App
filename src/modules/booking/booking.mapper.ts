import { BookingDto, BookingInput } from "./booking.interface";

export async function toBookingInput(params: BookingDto): Promise<BookingInput> {
	const output: BookingInput = {
		serviceId: "",
		bookingType: "APPOINTMENT",
		bookingTime: null,
		note: null,
		active: false,
		createdAt: null,
		updatedAt: null,
	};

	return output;
}
