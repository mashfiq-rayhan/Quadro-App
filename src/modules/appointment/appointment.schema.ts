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

const appointmentSchema = object({
	duration: number({
		required_error: "Duration is required",
		invalid_type_error: "Duration must be a number",
	}),
	paymentAcceptType: string({
		required_error: "Payment Accept Type is required.",
		invalid_type_error: "Payment Accept Type must be a String",
	}),
});

export const createAppointmentSchema = object({
	body: appointmentSchema.extend(createServiceSchema.shape),
});

export const appointmentParamsSchema = object({
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

export const updateAppointmentSchema = createAppointmentSchema.extend(appointmentParamsSchema.shape);

export type AppointmentParamsDto = TypeOf<typeof appointmentParamsSchema>["params"];
export type CreateAppointmentDto = TypeOf<typeof createAppointmentSchema>["body"];
