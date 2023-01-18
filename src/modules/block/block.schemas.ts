import z from "zod";

export const blockCreateSchema = z.object({
	body: z.object({
		startDate: z.date(),
		endDate: z.date(),
		notes: z.string().optional(),
	}),
});

export type BlockCreateDto = z.TypeOf<typeof blockCreateSchema>["body"];

export const blockUpdateSchema = z.object({
	params: z.object({
		id: z.string().optional(),
	}),
	body: z.object({
		startDate: z.date().optional(),
		endDate: z.date().optional(),
		notes: z.string().optional(),
	}),
});

export type BlockUpdateBodyDto = z.TypeOf<typeof blockUpdateSchema>["body"];
export type BlockUpdateParamsDto = z.TypeOf<typeof blockUpdateSchema>["params"];
