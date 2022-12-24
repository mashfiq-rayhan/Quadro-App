import { object, number, TypeOf } from "zod";

export const bookingSchema = object({
	serviceId: number({
		required_error: "serviceId is required.",
		invalid_type_error: "userId must be a Number",
	}),
});

export const bookingUpdateSchema = object({});

export type CreateBookingDto = TypeOf<typeof bookingSchema>;
export type UpdateBookingDto = TypeOf<typeof bookingUpdateSchema>;
