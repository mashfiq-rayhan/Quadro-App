import { object, string, TypeOf } from "zod";
import { Session } from "./session.models";
import { DocumentType } from "@typegoose/typegoose";

export const loginSchema = object({
	body: object({
		email: string({ required_error: "Email is required." }).email("Email is not valid."),
		password: string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
	}),
});

export type LoginDto = TypeOf<typeof loginSchema>["body"];

export type SessionDoc = DocumentType<Session>;
