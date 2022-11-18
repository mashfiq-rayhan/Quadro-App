import { object, string, TypeOf } from "zod";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "./user.model";

export type UserDoc = DocumentType<User>;

export const createUserSchema = object({
	body: object({
		email: string({ required_error: "Email is required." }).email("Email is not valid."),
		name: string({ required_error: "Name is required." }),
		password: string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
		passwordConfirmation: string({ required_error: "Password confirmation is required." }),
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords must match.",
		path: ["passwordConfirmation"],
	}),
});

export type CreateUserDto = TypeOf<typeof createUserSchema>["body"];

export const createUserGoogleSchema = object({
	body: object({
		email: string({ required_error: "Email is required." }).email("Email is not valid."),
		name: string({ required_error: "Name is required." }),
		method: string({ required_error: "Method is required." }),
		googleId: string({ required_error: "Google Id is required." }),
		profilePicture: string().optional(),
	}),
});

export type CreateUserGoogleDto = TypeOf<typeof createUserGoogleSchema>["body"];
