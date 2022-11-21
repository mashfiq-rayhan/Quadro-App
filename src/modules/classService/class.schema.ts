import { object, TypeOf, number, string } from "zod";
import { Types } from "mongoose";
import { createServiceSchema } from "../serviceInformation/service.schema";
import { ErrorCodes } from "../../errors/ErrorCodes";

function isValidObjectId(id: string): boolean {
	if (Types.ObjectId.isValid(id)) {
		if (String(new Types.ObjectId(id)) === id) return true;
		return false;
	}
	return false;
}

const classSchema = object({
	maxNumberOfParticipants: number({
		required_error: "Max Number Of Participants is required",
		invalid_type_error: "Max Number Of Participants must be a number",
	}),
});

export const createClassSchema = object({
	body: classSchema.extend(createServiceSchema.shape),
});

export const classParamsSchema = object({
	params: object({
		id: string({
			required_error: "No Id Provided", // Arbitrary
			invalid_type_error: "Id must be of Type String",
		}),
	}).refine((data) => isValidObjectId(data.id), {
		message: ErrorCodes.InvalidID,
		path: ["Id"],
	}),
});

export const updateClassSchema = createClassSchema.extend(classParamsSchema.shape);

export type ClassParamsDto = TypeOf<typeof classParamsSchema>["params"];
export type CreateClassDto = TypeOf<typeof createClassSchema>["body"];
