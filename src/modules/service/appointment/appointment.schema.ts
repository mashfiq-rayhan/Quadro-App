import { createServiceSchema } from "@src/modules/service/service/service.schema";
import { object, TypeOf, number, string } from "zod";

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
			invalid_type_error: "Id must be of Type Number",
		}),
	}),
});

export const updateAppointmentSchema = createAppointmentSchema.extend(appointmentParamsSchema.shape);

export type AppointmentParamsDto = TypeOf<typeof appointmentParamsSchema>["params"];
export type CreateAppointmentDto = TypeOf<typeof createAppointmentSchema>["body"];
