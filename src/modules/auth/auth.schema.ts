import { object, string, TypeOf } from "zod";

export const loginSchema = object({
	body: object({
		email: string({ required_error: "Email is required." }).email("Email is not valid."),
		password: string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
	}),
});

export type LoginDto = TypeOf<typeof loginSchema>["body"];

export const userUpdateSchema = object({
	body: object({
		name: string().optional(),
		phone: string().optional(),
		profilePicture: string().optional(),
		utm_campaign: string().optional(),
		utm_source: string().optional(),
		utm_medium: string().optional(),
		utm_content: string().optional(),
	}),
});

export type UserUpdateDto = TypeOf<typeof userUpdateSchema>["body"];
