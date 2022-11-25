import { object, TypeOf, string, ZodIssueCode } from "zod";
import { Types } from "mongoose";
import { ErrorCodes } from "../../errors/ErrorCodes";

const bookingSchema = object({
	body: object({
		serviceId: string({
			required_error: "serviceId is required.",
			invalid_type_error: "userId must be a String",
		}),

		bookingType: string({
			required_error: "bookingType is required.",
			invalid_type_error: "bookingType must be a String",
		}),
	}),
});

export type CreateBookingDto = TypeOf<typeof bookingSchema>["body"];
