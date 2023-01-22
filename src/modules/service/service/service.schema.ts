import lodash from "lodash";
import { object, string, TypeOf, number } from "zod";
import { LocationTypes } from "@prisma/client";
export const createServiceSchema = object({
	name: string({
		required_error: "Name is required.",
		invalid_type_error: "Name must be a String",
	}),
	location: number({
		required_error: "Location is required.",
		invalid_type_error: "Location must be a number",
	}).refine((data) => checkLocation(data), {
		message: "Invalid Location Value",
		path: ["location"],
	}),
	price: number({
		required_error: "Price is required",
		invalid_type_error: "Price must be a number",
	}),
	locationDescription: string().optional(),
});

export type CreateServiceDto = TypeOf<typeof createServiceSchema>;

function checkLocation(location: number): boolean {
	if (location in [1, 2, 3, 4]) return true;
	return false;
}
