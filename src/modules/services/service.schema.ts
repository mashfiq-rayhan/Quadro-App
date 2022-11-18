import { object, string, TypeOf, number } from "zod";

export const createServiceSchema = object({
	name: string({
		required_error: "Name is required.",
		invalid_type_error: "Name must be a String",
	}),
	location: string({
		required_error: "Location is required.",
		invalid_type_error: "Location must be a String",
	}),
	priceType: string({
		required_error: "Price Type is required.",
		invalid_type_error: "Price Type must be a String",
	}),
	price: number({
		required_error: "Price is required",
		invalid_type_error: "Price must be a number",
	}),
	paymentAcceptType: string({
		required_error: "Payment Accept Type is required.",
		invalid_type_error: "Payment Accept Type must be a String",
	}),
});

export type CreateServiceDto = TypeOf<typeof createServiceSchema>;
