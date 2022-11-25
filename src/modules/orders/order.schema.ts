import { object, TypeOf, string, ZodIssueCode } from "zod";
import { Types } from "mongoose";
import { ErrorCodes } from "../../errors/ErrorCodes";

function isValidObjectId(id: string): boolean {
	if (Types.ObjectId.isValid(id)) {
		if (String(new Types.ObjectId(id)) === id) return true;
		return false;
	}
	return false;
}

const bookingSchema = object({
	body: object({
		userId: string({
			required_error: "userId is required.",
			invalid_type_error: "userId must be a String",
		}),
		bookingType: string({
			required_error: "bookingType is required.",
			invalid_type_error: "bookingType must be a String",
		}),
		bookingRef: string({
			required_error: "bookingRef is required.",
			invalid_type_error: "bookingRef must be a String",
		}),
	}).superRefine((data, ctx) => {
		if (isValidObjectId(data.userId)) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: ErrorCodes.InvalidID,
			});
		}
	}),
});

// export type AppointmentParamsDto = TypeOf<typeof appointmentParamsSchema>["params"];
export type CreateBookingDto = TypeOf<typeof bookingSchema>["body"];
