import z from "zod";

enum OfferType {
	MEMBERSHIP = "MEMBERSHIP",
	PACKAGE = "PACKAGE",
}

enum PaymentOptions {
	RECURRING = "RECURRING",
	ONETIME = "ONETIME",
	FREE = "FREE",
}

export const planCreateSchema = z.object({
	body: z.object({
		name: z.string(),
		description: z.string().optional(),
		offerType: z.nativeEnum(OfferType).default(OfferType.MEMBERSHIP),
		numberOfSessions: z.number().nonnegative().default(0),
		services: z.array(z.number().positive().int()).optional(),
		paymentOption: z.nativeEnum(PaymentOptions).default(PaymentOptions.RECURRING),
		paymentPeriod: z.string().optional(),
		paymentLength: z.number().optional(),
		price: z.number().nonnegative(),
		hasFreeTrial: z.boolean().default(false),
		isSinglePurchase: z.boolean().default(false),
		willAllowCancellation: z.boolean().default(true),
		hasCustomStartDate: z.boolean().default(false),
		policies: z.string().optional(),
	}),
});

export type PlanCreateDto = z.TypeOf<typeof planCreateSchema>["body"];

export const planUpdateSchema = z.object({
	params: z.object({
		id: z.number().nonnegative().int().optional(),
	}),
	body: z.object({
		name: z.string().optional(),
		description: z.string().optional(),
		offerType: z.nativeEnum(OfferType).default(OfferType.MEMBERSHIP),
		numberOfSessions: z.number().nonnegative().default(0),
		services: z.array(z.number().positive().int()).optional(),
		paymentOption: z.nativeEnum(PaymentOptions).default(PaymentOptions.RECURRING),
		paymentPeriod: z.string().optional(),
		paymentLength: z.number().optional(),
		price: z.number().nonnegative().optional(),
		hasFreeTrial: z.boolean().default(false),
		isSinglePurchase: z.boolean().default(false),
		willAllowCancellation: z.boolean().default(true),
		hasCustomStartDate: z.boolean().default(false),
		policies: z.string().optional(),
	}),
});

export type PlanUpdateBodyDto = z.TypeOf<typeof planUpdateSchema>["body"];
export type PlanUpdateParamsDto = z.TypeOf<typeof planUpdateSchema>["params"];
