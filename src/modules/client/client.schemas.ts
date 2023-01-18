import z from "zod";

export const clientCreateSchema = z.object({
	body: z.object({
		name: z.string(),
		email: z.string().email().optional(),
		countryCode: z.string({ required_error: "Country code is required." }),
		phone: z.string(),
	}),
});

export type ClientCreateDto = z.TypeOf<typeof clientCreateSchema>["body"];

export const clientUpdateSchema = z.object({
	params: z.object({
		id: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		countryCode: z.string().optional(),
		phone: z.string().optional(),
		plans: z.array(z.number().positive().int()).optional(),
	}),
});

export type ClientUpdateBodyDto = z.TypeOf<typeof clientUpdateSchema>["body"];
export type ClientUpdateParamsDto = z.TypeOf<typeof clientUpdateSchema>["params"];

export const removePlanSchema = z.object({
	params: z.object({
		id: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		plans: z.array(z.number().positive().int()).optional(),
	}),
});

export type RemovePlanBodyDto = z.TypeOf<typeof removePlanSchema>["body"];
export type RemovePlanParamsDto = z.TypeOf<typeof removePlanSchema>["params"];

export const updatePlanInClientSchema = z.object({
	params: z.object({
		clientId: z.number().nonnegative().int().optional(),
		planId: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		hasPaid: z.boolean(),
	}),
});

export type UpdatePlanInClientBodyDto = z.TypeOf<typeof updatePlanInClientSchema>["body"];
export type UpdatePlanInClientParamsDto = z.TypeOf<typeof updatePlanInClientSchema>["params"];
