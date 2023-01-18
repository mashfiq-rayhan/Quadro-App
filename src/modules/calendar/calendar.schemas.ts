import z from "zod";

export const calendarCreateSchema = z.object({
	body: z
		.object({
			id: z.number().int().nonnegative().optional(),
			startDate: z.date().optional(),
			endDate: z.date().optional(),
			duration: z.number().int().positive().optional(),
			location: z.string().optional(),
			notes: z.string().optional(),
			hasCancelled: z.boolean().default(false),
			hasRefunded: z.boolean().default(false),
			appointmentId: z.number().optional(),
			classId: z.number().optional(),
			blockId: z.string().optional(),
			participantIds: z.array(z.number().positive().int()).optional(),
		})
		.refine(
			({ classId, blockId, appointmentId }) => [classId, blockId, appointmentId].filter((v) => v).length < 1,
			{ message: "Any one of the class or block or appointment id must be provided." },
		)
		.refine(
			({ classId, blockId, appointmentId }) => [classId, blockId, appointmentId].filter((v) => v).length > 1,
			{ message: "Only one of the class or block or appointment id can be provided." },
		),
});

export type CalendarCreateDto = z.TypeOf<typeof calendarCreateSchema>["body"];

export const calendarDeleteSchema = z.object({
	params: z.object({
		id: z.number().nonnegative().int().optional(),
	}),
});

export type CalendarDeleteParamsDto = z.TypeOf<typeof calendarDeleteSchema>["params"];

export const removeParticipantSchema = z.object({
	params: z.object({
		id: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		participantIds: z.array(z.number().positive().int()).optional(),
	}),
});

export type RemoveParticipantBodyDto = z.TypeOf<typeof removeParticipantSchema>["body"];
export type RemoveParticipantParamsDto = z.TypeOf<typeof removeParticipantSchema>["params"];

export const updateParticipantInCalendarSchema = z.object({
	params: z.object({
		clientId: z.number().nonnegative().int().optional(),
		calendarId: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		hasPaid: z.boolean(),
	}),
});

export type UpdateParticipantInCalendarBodyDto = z.TypeOf<typeof updateParticipantInCalendarSchema>["body"];
export type UpdateParticipantInCalendarParamsDto = z.TypeOf<typeof updateParticipantInCalendarSchema>["params"];
