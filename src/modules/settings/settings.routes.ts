import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import settingsController, { SettingsController } from "@modules/settings/settings.controllers";
import requireUserHandler from "@middlewares/requireUserHandler";

class SettingsRouter {
	public router: Router;
	private settingsController: SettingsController = settingsController;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(StatusCodes.OK).send("Settings router OK"));

		this.router.post("/bank-account/upsert", [requireUserHandler], this.settingsController.createBankAccount);

		this.router.get(
			"/bank-account/my-bank-account",
			[requireUserHandler],
			this.settingsController.findMyBankAccount,
		);

		this.router.get("/bank-account/:id", this.settingsController.findBankAccount);

		this.router.delete(
			"/bank-account/my-bank-account",
			[requireUserHandler],
			this.settingsController.deleteMyBankAccount,
		);

		this.router.delete("/bank-account/:id", this.settingsController.deleteBankAccount);

		this.router.post("/business-info/upsert", [requireUserHandler], this.settingsController.createBusinessInfo);

		this.router.get("/business-info/check-link", this.settingsController.checkServiceLink);

		this.router.get("/business-info/my-business", [requireUserHandler], this.settingsController.findMyBusinessInfo);

		this.router.get("/business-info/:id", this.settingsController.findBusinessInfo);

		this.router.delete(
			"/business-info/my-business",
			[requireUserHandler],
			this.settingsController.deleteMyBusinessInfo,
		);

		this.router.delete("/business-info/:id", this.settingsController.deleteBusinessInfo);

		this.router.post(
			"/protection-setting/upsert",
			[requireUserHandler],
			this.settingsController.createProtectionSetting,
		);

		this.router.get(
			"/protection-setting/my-protection",
			[requireUserHandler],
			this.settingsController.findMyProtectionSetting,
		);

		this.router.get("/protection-setting/:id", this.settingsController.findProtectionSetting);

		this.router.delete(
			"/protection-setting/my-protection",
			[requireUserHandler],
			this.settingsController.deleteMyProtectionSetting,
		);

		this.router.delete("/protection-setting/:id", this.settingsController.deleteProtectionSetting);

		this.router.post(
			"/automatic-charges/upsert",
			[requireUserHandler],
			this.settingsController.createAutomaticCharges,
		);

		this.router.get(
			"/automatic-charges/my-charges",
			[requireUserHandler],
			this.settingsController.findMyAutomaticCharges,
		);

		this.router.get("/automatic-charges/:id", this.settingsController.findAutomaticCharges);

		this.router.delete(
			"/automatic-charges/my-charges",
			[requireUserHandler],
			this.settingsController.deleteMyAutomaticCharges,
		);

		this.router.delete("/automatic-charges/:id", this.settingsController.deleteAutomaticCharges);

		this.router.post("/subscription-plan", this.settingsController.upsertSubscriptionPlan);

		this.router.get("/subscription-plan", this.settingsController.getSubscriptionPlans);

		this.router.put("/subscription-plan/:id", this.settingsController.upsertSubscriptionPlan);

		this.router.get("/subscription-plan/:id", this.settingsController.findSubscriptionPlan);

		this.router.delete("/subscription-plan/:id", this.settingsController.deleteSubscriptionPlan);

		this.router.post("/subscription", [requireUserHandler], this.settingsController.createSubscription);

		this.router.get("/subscription", this.settingsController.getSubscriptions);

		this.router.get(
			"/subscription/my-subscription",
			[requireUserHandler],
			this.settingsController.findMySubscription,
		);

		this.router.get("/subscription/:id", this.settingsController.findSubscription);

		this.router.delete(
			"/subscription/my-subscription",
			[requireUserHandler],
			this.settingsController.deleteMySubscription,
		);

		this.router.delete("/subscription/:id", this.settingsController.deleteSubscription);

		this.router.post("/transaction", [requireUserHandler], this.settingsController.upsertTransaction);

		this.router.get("/transaction", [requireUserHandler], this.settingsController.getMyTransactions);

		this.router.put("/transaction/:id", [requireUserHandler], this.settingsController.upsertTransaction);

		this.router.get("/transaction/:id", this.settingsController.findTransaction);

		this.router.delete("/transaction/:id", this.settingsController.deleteTransaction);

		this.router.post("/digital-payment", [requireUserHandler], this.settingsController.upsertDigitalPayment);

		this.router.put("/digital-payment/my", [requireUserHandler], this.settingsController.upsertDigitalPayment);

		this.router.get("/digital-payment/my", [requireUserHandler], this.settingsController.findMyDigitalPaymentInfo);

		this.router.get("/digital-payment/:id", this.settingsController.findDigitalPaymentInfo);

		this.router.delete(
			"/digital-payment/my",
			[requireUserHandler],
			this.settingsController.deleteDigitalPaymentInfo,
		);

		this.router.delete("/digital-payment/:id", this.settingsController.deleteDigitalPaymentInfo);

		this.router.post("/full-potential", [requireUserHandler], this.settingsController.upsertFullPotential);

		this.router.put("/full-potential/my", [requireUserHandler], this.settingsController.upsertFullPotential);

		this.router.get("/full-potential/my", [requireUserHandler], this.settingsController.findMyFullPotentialInfo);

		this.router.get("/full-potential/:id", this.settingsController.findFullPotentialInfo);

		this.router.delete(
			"/full-potential/my",
			[requireUserHandler],
			this.settingsController.deleteMyFullPotentialInfo,
		);

		this.router.delete("/full-potential/:id", this.settingsController.deleteFullPotentialInfo);

		this.router.post(
			"/complete-percentage",
			[requireUserHandler],
			this.settingsController.upsertCompletePercentage,
		);

		this.router.put(
			"/complete-percentage/my",
			[requireUserHandler],
			this.settingsController.upsertCompletePercentage,
		);

		this.router.get(
			"/complete-percentage/my",
			[requireUserHandler],
			this.settingsController.findMyCompletePercentage,
		);

		this.router.get("/complete-percentage/:id", this.settingsController.findCompletePercentage);

		this.router.delete(
			"/complete-percentage/my",
			[requireUserHandler],
			this.settingsController.deleteMyCompletePercentage,
		);

		this.router.delete("/complete-percentage/:id", this.settingsController.deleteCompletePercentage);

		this.router.get("/sharing/:subdomain", this.settingsController.resolveSharing);
	};
}

const settingsRouter = new SettingsRouter();

export default settingsRouter.router;
