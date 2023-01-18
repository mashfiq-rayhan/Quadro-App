import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

export class SettingsServices {
	public createBankAccount = async (data: Prisma.BankAccountCreateArgs) => {
		return await prisma.bankAccount.create(data);
	};

	public updateBankAccount = async (data: Prisma.BankAccountUpdateArgs) => {
		return await prisma.bankAccount.update(data);
	};

	public upsertBankAccount = async (data: Prisma.BankAccountUpsertArgs) => {
		return await prisma.bankAccount.upsert(data);
	};

	public findBankAccount = async (filter: Prisma.BankAccountFindFirstArgs) => {
		return await prisma.bankAccount.findFirst(filter);
	};

	public deleteBankAccount = async (args: Prisma.BankAccountDeleteArgs) => {
		console.log(args);
		return await prisma.bankAccount.delete(args);
	};

	public createBusinessInfo = async (data: Prisma.BusinessInfoSettingCreateArgs) => {
		return await prisma.businessInfoSetting.create(data);
	};

	public upsertBusinessInfo = async (data: Prisma.BusinessInfoSettingUpsertArgs) => {
		return await prisma.businessInfoSetting.upsert(data);
	};

	public findBusinessInfo = async (filter: Prisma.BusinessInfoSettingFindFirstArgs) => {
		return await prisma.businessInfoSetting.findFirst(filter);
	};

	public deleteBusinessInfo = async (args: Prisma.BusinessInfoSettingDeleteArgs) => {
		return await prisma.businessInfoSetting.delete(args);
	};

	public createProtectionSetting = async (data: Prisma.ProtectionSettingCreateArgs) => {
		return await prisma.protectionSetting.create(data);
	};

	public upsertProtectionSetting = async (data: Prisma.ProtectionSettingUpsertArgs) => {
		return await prisma.protectionSetting.upsert(data);
	};

	public findProtectionSetting = async (filter: Prisma.ProtectionSettingFindFirstArgs) => {
		return await prisma.protectionSetting.findFirst(filter);
	};

	public deleteProtectionSetting = async (args: Prisma.ProtectionSettingDeleteArgs) => {
		return await prisma.protectionSetting.delete(args);
	};

	public createAutomaticCharges = async (data: Prisma.AutomaticChargesSettingCreateArgs) => {
		return await prisma.automaticChargesSetting.create(data);
	};

	public upsertAutomaticCharges = async (data: Prisma.AutomaticChargesSettingUpsertArgs) => {
		return await prisma.automaticChargesSetting.upsert(data);
	};

	public findAutomaticCharges = async (filter: Prisma.AutomaticChargesSettingFindFirstArgs) => {
		return await prisma.automaticChargesSetting.findFirst(filter);
	};

	public deleteAutomaticCharges = async (args: Prisma.AutomaticChargesSettingDeleteArgs) => {
		return await prisma.automaticChargesSetting.delete(args);
	};

	public createSubscriptionPlan = async (data: Prisma.SubscriptionPlanCreateArgs) => {
		return await prisma.subscriptionPlan.create(data);
	};

	public updateSubscriptionPlan = async (data: Prisma.SubscriptionPlanUpdateArgs) => {
		return await prisma.subscriptionPlan.update(data);
	};

	public upsertSubscriptionPlan = async (data: Prisma.SubscriptionPlanUpsertArgs) => {
		return await prisma.subscriptionPlan.upsert(data);
	};

	public findSubscriptionPlan = async (filter: Prisma.SubscriptionPlanFindFirstArgs) => {
		return await prisma.subscriptionPlan.findFirst(filter);
	};

	public getSubscriptionPlans = async (filter: Prisma.SubscriptionPlanFindManyArgs) => {
		return await prisma.subscriptionPlan.findMany(filter);
	};

	public deleteSubscriptionPlan = async (args: Prisma.SubscriptionPlanDeleteArgs) => {
		return await prisma.subscriptionPlan.delete(args);
	};

	public createSubscription = async (data: Prisma.SubscriptionCreateArgs) => {
		return await prisma.subscription.create(data);
	};

	public updateSubscription = async (data: Prisma.SubscriptionUpdateArgs) => {
		return await prisma.subscription.update(data);
	};

	public upsertSubscription = async (data: Prisma.SubscriptionUpsertArgs) => {
		return await prisma.subscription.upsert(data);
	};

	public findSubscription = async (filter: Prisma.SubscriptionFindFirstArgs) => {
		return await prisma.subscription.findFirst(filter);
	};

	public getSubscriptions = async (filter: Prisma.SubscriptionFindManyArgs) => {
		return await prisma.subscription.findMany(filter);
	};

	public deleteSubscription = async (args: Prisma.SubscriptionDeleteArgs) => {
		return await prisma.subscription.delete(args);
	};

	public createTransaction = async (data: Prisma.TransactionCreateArgs) => {
		return await prisma.transaction.create(data);
	};

	public updateTransaction = async (data: Prisma.TransactionUpdateArgs) => {
		return await prisma.transaction.update(data);
	};

	public upsertTransaction = async (data: Prisma.TransactionUpsertArgs) => {
		return await prisma.transaction.upsert(data);
	};

	public getTransactions = async (filter: Prisma.TransactionFindManyArgs) => {
		return await prisma.transaction.findMany(filter);
	};

	public findTransaction = async (filter: Prisma.TransactionFindFirstArgs) => {
		return await prisma.transaction.findFirst(filter);
	};

	public deleteTransaction = async (args: Prisma.TransactionDeleteArgs) => {
		return await prisma.transaction.delete(args);
	};

	public createDigitalPayment = async (data: Prisma.DigitalPaymentCreateArgs) => {
		return await prisma.digitalPayment.create(data);
	};

	public updateDigitalPayment = async (data: Prisma.DigitalPaymentUpdateArgs) => {
		return await prisma.digitalPayment.update(data);
	};

	public upsertDigitalPayment = async (data: Prisma.DigitalPaymentUpsertArgs) => {
		return await prisma.digitalPayment.upsert(data);
	};

	public getDigitalPayment = async (filter: Prisma.DigitalPaymentFindManyArgs) => {
		return await prisma.digitalPayment.findMany(filter);
	};

	public findDigitalPayment = async (filter: Prisma.DigitalPaymentFindFirstArgs) => {
		return await prisma.digitalPayment.findFirst(filter);
	};

	public deleteDigitalPayment = async (args: Prisma.DigitalPaymentDeleteArgs) => {
		return await prisma.digitalPayment.delete(args);
	};

	public createFullPotential = async (data: Prisma.FullPotentialCreateArgs) => {
		return await prisma.fullPotential.create(data);
	};

	public updateFullPotential = async (data: Prisma.FullPotentialUpdateArgs) => {
		return await prisma.fullPotential.update(data);
	};

	public upsertFullPotential = async (data: Prisma.FullPotentialUpsertArgs) => {
		return await prisma.fullPotential.upsert(data);
	};

	public getFullPotential = async (filter: Prisma.FullPotentialFindManyArgs) => {
		return await prisma.fullPotential.findMany(filter);
	};

	public findFullPotential = async (filter: Prisma.FullPotentialFindFirstArgs) => {
		return await prisma.fullPotential.findFirst(filter);
	};

	public deleteFullPotential = async (args: Prisma.FullPotentialDeleteArgs) => {
		return await prisma.fullPotential.delete(args);
	};

	public createCompletePercentage = async (data: Prisma.CompletePercentageCreateArgs) => {
		return await prisma.completePercentage.create(data);
	};

	public updateCompletePercentage = async (data: Prisma.CompletePercentageUpdateArgs) => {
		return await prisma.completePercentage.update(data);
	};

	public upsertCompletePercentage = async (data: Prisma.CompletePercentageUpsertArgs) => {
		return await prisma.completePercentage.upsert(data);
	};

	public getCompletePercentage = async (filter: Prisma.CompletePercentageFindManyArgs) => {
		return await prisma.completePercentage.findMany(filter);
	};

	public findCompletePercentage = async (filter: Prisma.CompletePercentageFindFirstArgs) => {
		return await prisma.completePercentage.findFirst(filter);
	};

	public deleteCompletePercentage = async (args: Prisma.CompletePercentageDeleteArgs) => {
		return await prisma.completePercentage.delete(args);
	};
}

const settingsServices: SettingsServices = new SettingsServices();

export default settingsServices;
