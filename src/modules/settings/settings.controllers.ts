import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import settingsServices, { SettingsServices } from "@modules/settings/settings.services";
import {
	AutomaticChargesCreateDto,
	BankAccountCreateDto,
	BusinessInfoCreateDto,
	ProtectionCreateDto,
	SubscriptionCreateDto,
	SubscriptionPlanCreateDto,
	TransactionCreateDto,
} from "@modules/settings/settings.schemas";
import userServices, { UserServices } from "@modules/users/user.services";

export class SettingsController {
	private settingsServices: SettingsServices = settingsServices;
	private userServices: UserServices = userServices;

	private userSelect = {
		id: true,
		name: true,
		email: true,
		phone: true,
		verified: true,
		profilePicture: true,
		createdAt: true,
		updatedAt: true,
	};

	public createBankAccount = async (
		req: Request<{}, {}, BankAccountCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createBankAccount");
		const body = req.body;
		const { userId } = req;

		try {
			const account = await settingsServices.upsertBankAccount({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(account);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findMyBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findMyBankAccount");
		const { userId } = req;

		try {
			const account = await settingsServices.findBankAccount({ where: { userId } });

			if (account) {
				return res.status(StatusCodes.OK).json(account);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Bank account not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findBankAccount");
		const { id } = req.params;

		try {
			const account = await settingsServices.findBankAccount({ where: { id: Number(id) } });

			if (account) {
				return res.status(StatusCodes.OK).json(account);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Bank account not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteMyBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteMyBankAccount");
		const { userId } = req;

		try {
			await settingsServices.deleteBankAccount({ where: { userId } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteBankAccount");
		const { id } = req.params;

		try {
			await settingsServices.deleteBankAccount({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public createBusinessInfo = async (
		req: Request<{}, {}, BusinessInfoCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createBusinessInfo");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await settingsServices.upsertBusinessInfo({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(settings);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findMyBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findMyBusinessInfo");
		const { userId } = req;

		try {
			const settings = await settingsServices.findBusinessInfo({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Business info not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findBusinessInfo");
		const { id } = req.params;

		try {
			const settings = await settingsServices.findBusinessInfo({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Business info not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteMyBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteMyBusinessInfo");
		const { userId } = req;

		try {
			await settingsServices.deleteBusinessInfo({ where: { userId } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteBusinessInfo");
		const { id } = req.params;

		try {
			await settingsServices.deleteBusinessInfo({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public createProtectionSetting = async (
		req: Request<{}, {}, ProtectionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createProtectionSetting");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await settingsServices.upsertProtectionSetting({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(settings);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findMyProtectionSetting = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyProtectionSetting");
		const { userId } = req;

		try {
			const settings = await settingsServices.findProtectionSetting({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Protection setting not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findProtectionSetting = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findProtectionSetting");
		const { id } = req.params;

		try {
			const settings = await settingsServices.findProtectionSetting({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Protection setting not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteMyProtectionSetting = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyProtectionSetting");
		const { userId } = req;

		try {
			await settingsServices.deleteProtectionSetting({ where: { userId } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteProtectionSetting = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteProtectionSetting");
		const { id } = req.params;

		try {
			await settingsServices.deleteProtectionSetting({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public createAutomaticCharges = async (
		req: Request<{}, {}, AutomaticChargesCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createAutomaticCharges");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await settingsServices.upsertAutomaticCharges({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(settings);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findMyAutomaticCharges = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyAutomaticCharges");
		const { userId } = req;

		try {
			const settings = await settingsServices.findAutomaticCharges({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Automatic charges setting not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findAutomaticCharges = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findAutomaticCharges");
		const { id } = req.params;

		try {
			const settings = await settingsServices.findAutomaticCharges({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Automatic charges setting not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteMyAutomaticCharges = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyAutomaticCharges");
		const { userId } = req;

		try {
			await settingsServices.deleteAutomaticCharges({ where: { userId } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteAutomaticCharges = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteAutomaticCharges");
		const { id } = req.params;

		try {
			await settingsServices.deleteAutomaticCharges({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public upsertSubscriptionPlan = async (
		req: Request<{ id?: number }, {}, SubscriptionPlanCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createSubscriptionPlan");
		const body = req.body;
		const { id } = req.params;

		try {
			if (id) {
				const settings = await settingsServices.updateSubscriptionPlan({
					where: { id: Number(id) },
					data: body,
				});
				return res.status(StatusCodes.OK).json(settings);
			} else {
				const settings = await settingsServices.createSubscriptionPlan({ data: body });
				return res.status(StatusCodes.CREATED).json(settings);
			}
		} catch (e: any) {
			console.log(e);

			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findSubscriptionPlan");
		const { id } = req.params;

		try {
			const settings = await settingsServices.findSubscriptionPlan({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscription plan not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public getSubscriptionPlans = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] getSubscriptionPlans");

		try {
			const settings = await settingsServices.getSubscriptionPlans({});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscription plans not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteSubscriptionPlan = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteSubscriptionPlan");
		const { id } = req.params;

		try {
			await settingsServices.deleteSubscriptionPlan({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public createSubscription = async (
		req: Request<{}, {}, SubscriptionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createSubscription");
		const body = req.body;
		const { userId } = req;
		const { planId, ...others } = body;

		try {
			const settings = await settingsServices.upsertSubscription({
				create: {
					...others,
					user: { connect: { id: userId } },
					subscriptionPlan: planId ? { connect: { id: planId } } : undefined,
				},
				update: { ...others, subscriptionPlan: planId ? { connect: { id: planId } } : undefined },
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(settings);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findMySubscription = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMySubscription");
		const { userId } = req;
		const { hasUser, hasPlan } = req.query;

		try {
			const settings = await settingsServices.findSubscription({
				where: { userId },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscription not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findSubscription = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findSubscription");
		const { id } = req.params;
		const { hasUser, hasPlan } = req.query;

		try {
			const settings = await settingsServices.findSubscription({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscription not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public getSubscriptions = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasPlan: boolean; take: number; skip: number }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getSubscriptions");
		const { hasUser, hasPlan, take, skip } = req.query;

		try {
			const settings = await settingsServices.getSubscriptions({
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
				take: take ? Number(take) : undefined,
				skip: skip ? Number(skip) : undefined,
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscriptions not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteMySubscription = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteMySubscription");
		const { userId } = req;

		try {
			await settingsServices.deleteSubscription({ where: { userId } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteSubscription = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteSubscription");
		const { id } = req.params;

		try {
			await settingsServices.deleteSubscription({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public upsertTransaction = async (
		req: Request<{ id?: number }, {}, TransactionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] upsertTransaction");
		const body = req.body;
		const { userId } = req;
		const { id } = req.params;
		const { planId, subId, ...others } = body;

		try {
			const settings = await settingsServices.upsertTransaction({
				create: {
					...others,
					user: { connect: { id: userId } },
					subscription: subId ? { connect: { userId, id: subId } } : undefined,
					subscriptionPlan: planId ? { connect: { id: planId } } : undefined,
				},
				update: { ...others, subscriptionPlan: planId ? { connect: { id: planId } } : undefined },
				where: { id: Number(id) },
			});
			return res.status(StatusCodes.CREATED).json(settings);
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public findTransaction = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasPlan: boolean; hasSub: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findTransaction");
		const { id } = req.params;
		const { hasUser, hasPlan, hasSub } = req.query;

		try {
			const settings = await settingsServices.findTransaction({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
					subscription: Boolean(hasSub),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Transaction not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public getMyTransactions = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasPlan: boolean; hasSub: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyTransactions");
		const { userId } = req;
		const { hasUser, hasPlan, hasSub } = req.query;

		try {
			const settings = await settingsServices.getTransactions({
				where: { userId },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
					subscription: Boolean(hasSub),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(settings);
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Subscription not found.",
					}),
				);
			}
		} catch (e) {
			console.log(e);
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};

	public deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteTransaction");
		const { id } = req.params;

		try {
			await settingsServices.deleteTransaction({ where: { id: Number(id) } });

			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (e: any) {
			if (e?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: e?.meta?.cause,
					}),
				);
			}

			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					description: "Something went wrong.",
				}),
			);
		}
	};
}

const settingsController: SettingsController = new SettingsController();

export default settingsController;
