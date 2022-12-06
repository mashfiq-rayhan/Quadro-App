import { object, string, TypeOf } from "zod";

export const bookingSchema = object({
	serviceId: string({
		required_error: "serviceId is required.",
		invalid_type_error: "userId must be a String",
	}),
});

export const bookingUpdateSchema = object({});

export type CreateBookingDto = TypeOf<typeof bookingSchema>;
export type UpdateBookingDto = TypeOf<typeof bookingUpdateSchema>;
