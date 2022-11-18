import { object, string, TypeOf } from "zod";
import { Types } from "mongoose";

export const getByIdSchema = object({
	params: object({
		id: string({ required_error: "ID is required." }).refine(
			(val) => Types.ObjectId.isValid(val),
			(val) => ({ message: `${val} is not a valid id.` }),
		),
	}),
});

export type GetByIdDto = TypeOf<typeof getByIdSchema>["params"];
