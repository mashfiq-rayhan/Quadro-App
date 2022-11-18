import { object, TypeOf, number, string } from "zod";
import { Types } from "mongoose";
import { createServiceSchema } from "../services/service.schema";

function isValidObjectId(id: string): boolean {
	if (Types.ObjectId.isValid(id)) {
		if (String(new Types.ObjectId(id)) === id) return true;
		return false;
	}
	return false;
}

const appointmentSchema = object({
	duration: number({
		required_error: "Duration is required",
		invalid_type_error: "Duration must be a number",
	}),

	timeBetweenSession: number({
		required_error: "Time Between Session is required",
		invalid_type_error: "Time Between Session must be a number",
	}),
});

export const createAppointmentSchema = object({
	body: appointmentSchema.extend(createServiceSchema.shape),
});

export const getAppointmentSchema = object({
	params: object({
		id: string({
			required_error: "No Id Provided", // Arbitrary
			invalid_type_error: "Id must be of Type String",
		}),
	}).refine((data) => isValidObjectId(data.id), {
		message: "Invalid Id",
		path: ["Id"],
	}),
});

export const updateAppointmentSchema = createAppointmentSchema.extend(getAppointmentSchema.shape);
export type GetAppointmentDto = TypeOf<typeof getAppointmentSchema>["params"];
export type CreateAppointmentDto = TypeOf<typeof createAppointmentSchema>["body"];
export type UpdateAppointmentDto = TypeOf<typeof updateAppointmentSchema>;
