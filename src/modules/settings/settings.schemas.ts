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
		phone: string().optional(),
		serviceKind: string().optional(),
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
		uId: number().int().nonnegative().optional(),
		subId: number().int().nonnegative().optional(),
		planId: number().int().nonnegative().optional(),
	}),
});

export type TransactionCreateDto = TypeOf<typeof transactionCreateSchema>["body"];

export const digitalPaymentCreateSchema = object({
	body: object({
		verify: boolean().optional(),
		pix: boolean().optional(),
		megapay: boolean().optional(),
		payeer: boolean().optional(),
		cash: boolean().optional(),
	}),
});

export type DigitalPaymentCreateDto = TypeOf<typeof digitalPaymentCreateSchema>["body"];

export const fullPotentialSchema = object({
	body: object({
		data: any().optional(),
	}),
});

export type FullPotentialDto = TypeOf<typeof fullPotentialSchema>["body"];

export const completePercentageSchema = object({
	body: object({
		schedulingOnline: boolean().optional(),
		increaseCatalogue: boolean().optional(),
		digitalPayments: boolean().optional(),
		importCustomers: boolean().optional(),
		protectYourself: boolean().optional(),
		automaticCharges: boolean().optional(),
	}),
});

export type CompletePercentageDto = TypeOf<typeof completePercentageSchema>["body"];
