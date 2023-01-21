import lodash from "lodash";
import { object, string, TypeOf, number } from "zod";
import { LocationTypes } from "@prisma/client";
export const createServiceSchema = object({
	name: string({
		required_error: "Name is required.",
		invalid_type_error: "Name must be a String",
	}),
	location: string({
		required_error: "Location is required.",
		invalid_type_error: "Location must be a String",
	}).refine((data) => checkLocation(data), {
		message: "Invalid Location Type",
		path: ["location"],
	}),
	price: number({
		required_error: "Price is required",
		invalid_type_error: "Price must be a number",
	}),
});

export type CreateServiceDto = TypeOf<typeof createServiceSchema>;

function checkLocation(location): boolean {
	switch (location.toUpperCase()) {
		case LocationTypes.BUSINESS:
			return true;
		case LocationTypes.ONLINE:
			return true;
		case LocationTypes.CLIENT:
			return true;
		default:
			return false;
	}
}
