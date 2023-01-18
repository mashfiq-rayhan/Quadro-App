import { z } from "zod";

const MAX_FILE_SIZE = 1000000; // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ["image/gif", "image/jpeg", "image/png"];

const fileUploadSchema = z.object({
	file: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_MIME_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported.",
		),
});

export type FileUploadDto = z.TypeOf<typeof fileUploadSchema>["file"];

const filesUploadSchema = z.object({
	files: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_MIME_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported.",
		)
		.array(),
});

export type FilesUploadDto = z.TypeOf<typeof filesUploadSchema>["files"];
