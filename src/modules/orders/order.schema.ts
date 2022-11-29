import { object, TypeOf, string } from "zod";
import { bookingSchema } from "../booking/booking.schema";

const orderSchema = object({
	clientId: string({
		required_error: "userId is required.",
		invalid_type_error: "userId must be a String",
	}),
	businessId: string({
		required_error: "bookingType is required.",
		invalid_type_error: "bookingType must be a String",
	}),
});

export const createOrderSchema = object({
	body: orderSchema.extend(bookingSchema.shape),
});

export const orderParamsSchema = object({
	params: object({
		id: string({
			required_error: "No Id Provided", // Arbitrary
		}),
	}),
});

export type OrderParamsDto = TypeOf<typeof orderParamsSchema>["params"];
export type CreateOrderDto = TypeOf<typeof orderSchema>;
