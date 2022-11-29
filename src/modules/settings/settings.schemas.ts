import z, { any, boolean, number, object, string, TypeOf } from "zod";

enum SubscriptionType {
	FOREVER = "FOREVER",
	HOURLY = "HOURLY",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	BIWEEKLY = "BIWEEKLY",
	MONTHLY = "MONTHLY",
	YEARLY = "YEARLY",
}

export const bankAccountCreateSchema = object({
	body: object({
		beneficiary_name: string(),
		account_number: string(),
		bank_name: string(),
		bank_code: string(),
		other: string().optional(),
	}),
});

export type BankAccountCreateDto = TypeOf<typeof bankAccountCreateSchema>["body"];

export const businessInfoCreateSchema = object({
	body: object({
		name: string().optional(),
		description: string().optional(),
		link: string().optional(),
		address: string().optional(),
		logo: string().optional(),
		openHours: any().optional(),
		calendar: string().optional(),
		interval: string().optional(),
		availability: string().optional(),
		advanceNotice: string().optional(),
	}),
});

export type BusinessInfoCreateDto = TypeOf<typeof businessInfoCreateSchema>["body"];

export const protectionCreateSchema = object({
	body: object({
		activatePolicy: boolean(),
		time: string().optional(),
		toleranceDelay: string().optional(),
	}),
});

export type ProtectionCreateDto = TypeOf<typeof protectionCreateSchema>["body"];

export const automaticChargesCreateSchema = object({
	body: object({
		eachAppointment: boolean(),
		eachPlan: boolean(),
		frequency: string().optional(),
	}),
});

export type AutomaticChargesCreateDto = TypeOf<typeof automaticChargesCreateSchema>["body"];

export const subscriptionPlanCreateSchema = object({
	body: object({
		name: string(),
		tagLine: string(),
		amount: number(),
		discountedAmount: number().optional(),
		subscriptionType: z.nativeEnum(SubscriptionType),
		iconColor: string().optional(),
		isRecommended: boolean().optional(),
		features: any().optional(),
	}),
});

export type SubscriptionPlanCreateDto = TypeOf<typeof subscriptionPlanCreateSchema>["body"];

export const subscriptionCreateSchema = object({
	body: object({
		billingDetails: string().optional(),
		billingAddress: string(),
		billingEmail: string(),
		isSubscribed: boolean().optional(),
		planId: number().optional(),
	}),
});

export type SubscriptionCreateDto = TypeOf<typeof subscriptionCreateSchema>["body"];

export const transactionCreateSchema = object({
	body: object({
		amount: number(),
		uId: number().optional(),
		subId: number().optional(),
		planId: number().optional(),
	}),
});

export type TransactionCreateDto = TypeOf<typeof transactionCreateSchema>["body"];
