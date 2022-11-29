import { object, TypeOf, string, ZodIssueCode, date } from "zod";
import { Types } from "mongoose";
import { ErrorCodes } from "../../errors/ErrorCodes";

export const bookingSchema = object({
	serviceId: string({
		required_error: "serviceId is required.",
		invalid_type_error: "userId must be a String",
	}),
	bookingType: string({
		required_error: "bookingType is required.",
		invalid_type_error: "bookingType must be a String",
	}),
	bookingTime: date({
		required_error: " Select a Time For Booking ",
		invalid_type_error: "bookingTime must be a DateTime Object",
	}),
});

export type CreateBookingDto = TypeOf<typeof bookingSchema>;
