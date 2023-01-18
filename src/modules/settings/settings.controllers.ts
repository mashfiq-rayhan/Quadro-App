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
	CompletePercentageDto,
	DigitalPaymentCreateDto,
	FullPotentialDto,
	ProtectionCreateDto,
	SubscriptionCreateDto,
	SubscriptionPlanCreateDto,
	TransactionCreateDto,
} from "@modules/settings/settings.schemas";
import { returnVal } from "@utils/return";

export class SettingsController {
	private settingsServices: SettingsServices = settingsServices;

	private userSelect: object = {
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
			const account = await this.settingsServices.upsertBankAccount({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(account));
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
			const account = await this.settingsServices.findBankAccount({ where: { userId } });

			if (account) {
				return res.status(StatusCodes.OK).json(returnVal(account));
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
			const account = await this.settingsServices.findBankAccount({ where: { id: Number(id) } });

			if (account) {
				return res.status(StatusCodes.OK).json(returnVal(account));
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
			await this.settingsServices.deleteBankAccount({ where: { userId } });

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
			await this.settingsServices.deleteBankAccount({ where: { id: Number(id) } });

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
			const settings = await this.settingsServices.upsertBusinessInfo({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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

	public checkServiceLink = async (
		req: Request<{}, {}, {}, { link: string }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] checkServiceLink");
		const { link } = req.query;

		try {
			if (link) {
				const settings = await this.settingsServices.findBusinessInfo({ where: { link } });

				if (settings) {
					return res.status(StatusCodes.OK).json(returnVal({ message: `Link "${link}" already exists` }));
				} else {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(returnVal({ message: `Link "${link}" does not exist` }));
				}
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.ValidationError,
						status: StatusCodes.BAD_REQUEST,
						description: "No link provided.",
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

	public findMyBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] findMyBusinessInfo");
		const { userId } = req;

		try {
			const settings = await this.settingsServices.findBusinessInfo({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.findBusinessInfo({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			await this.settingsServices.deleteBusinessInfo({ where: { userId } });

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
			await this.settingsServices.deleteBusinessInfo({ where: { id: Number(id) } });

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
			const settings = await this.settingsServices.upsertProtectionSetting({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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
			const settings = await this.settingsServices.findProtectionSetting({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.findProtectionSetting({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			await this.settingsServices.deleteProtectionSetting({ where: { userId } });

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
			await this.settingsServices.deleteProtectionSetting({ where: { id: Number(id) } });

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
			const settings = await this.settingsServices.upsertAutomaticCharges({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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
			const settings = await this.settingsServices.findAutomaticCharges({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.findAutomaticCharges({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			await this.settingsServices.deleteAutomaticCharges({ where: { userId } });

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
			await this.settingsServices.deleteAutomaticCharges({ where: { id: Number(id) } });

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
				const settings = await this.settingsServices.updateSubscriptionPlan({
					where: { id: Number(id) },
					data: body,
				});
				return res.status(StatusCodes.OK).json(settings);
			} else {
				const settings = await this.settingsServices.createSubscriptionPlan({ data: body });
				return res.status(StatusCodes.CREATED).json(returnVal(settings));
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
			const settings = await this.settingsServices.findSubscriptionPlan({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.getSubscriptionPlans({});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			await this.settingsServices.deleteSubscriptionPlan({ where: { id: Number(id) } });

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
			const settings = await this.settingsServices.upsertSubscription({
				create: {
					...others,
					user: { connect: { id: userId } },
					subscriptionPlan: planId ? { connect: { id: planId } } : undefined,
				},
				update: { ...others, subscriptionPlan: planId ? { connect: { id: planId } } : undefined },
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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
			const settings = await this.settingsServices.findSubscription({
				where: { userId },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.findSubscription({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.getSubscriptions({
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
				},
				take: take ? Number(take) : undefined,
				skip: skip ? Number(skip) : undefined,
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			await this.settingsServices.deleteSubscription({ where: { userId } });

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
			await this.settingsServices.deleteSubscription({ where: { id: Number(id) } });

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
			const settings = await this.settingsServices.upsertTransaction({
				create: {
					...others,
					user: { connect: { id: userId } },
					subscription: subId ? { connect: { id: subId } } : undefined,
					subscriptionPlan: planId ? { connect: { id: planId } } : undefined,
				},
				update: { ...others, subscriptionPlan: planId ? { connect: { id: planId } } : undefined },
				where: { id: id ? Number(id) : 0 },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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

	public findTransaction = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasPlan: boolean; hasSub: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findTransaction");
		const { id } = req.params;
		const { hasUser, hasPlan, hasSub } = req.query;

		try {
			const settings = await this.settingsServices.findTransaction({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
					subscription: Boolean(hasSub),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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
			const settings = await this.settingsServices.getTransactions({
				where: { userId },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					subscriptionPlan: Boolean(hasPlan),
					subscription: Boolean(hasSub),
				},
			});

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
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

	public deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		log.info("[controller] deleteTransaction");
		const { id } = req.params;

		try {
			await this.settingsServices.deleteTransaction({ where: { id: Number(id) } });

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

	public upsertDigitalPayment = async (
		req: Request<{}, {}, DigitalPaymentCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] upsertDigitalPayment");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await this.settingsServices.upsertDigitalPayment({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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

	public findMyDigitalPaymentInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyDigitalPaymentInfo");
		const { userId } = req;

		try {
			const settings = await this.settingsServices.findDigitalPayment({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Digital payment not found.",
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

	public findDigitalPaymentInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findDigitalPaymentInfo");
		const { id } = req.params;

		try {
			const settings = await this.settingsServices.findDigitalPayment({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Digital payment not found.",
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

	public deleteMyDigitalPaymentInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyDigitalPaymentInfo");
		const { userId } = req;

		try {
			await this.settingsServices.deleteDigitalPayment({ where: { userId } });

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

	public deleteDigitalPaymentInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteDigitalPaymentInfo");
		const { id } = req.params;

		try {
			await this.settingsServices.deleteDigitalPayment({ where: { id: Number(id) } });

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

	public upsertFullPotential = async (
		req: Request<{}, {}, FullPotentialDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] upsertFullPotential");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await this.settingsServices.upsertFullPotential({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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

	public findMyFullPotentialInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyFullPotentialInfo");
		const { userId } = req;

		try {
			const settings = await this.settingsServices.findFullPotential({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Full potential not found.",
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

	public findFullPotentialInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findFullPotentialInfo");
		const { id } = req.params;

		try {
			const settings = await this.settingsServices.findFullPotential({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Full potential not found.",
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

	public deleteMyFullPotentialInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyFullPotentialInfo");
		const { userId } = req;

		try {
			await this.settingsServices.deleteFullPotential({ where: { userId } });

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

	public deleteFullPotentialInfo = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteFullPotentialInfo");
		const { id } = req.params;

		try {
			await this.settingsServices.deleteFullPotential({ where: { id: Number(id) } });

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

	public upsertCompletePercentage = async (
		req: Request<{}, {}, CompletePercentageDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] upsertCompletePercentage");
		const body = req.body;
		const { userId } = req;

		try {
			const settings = await this.settingsServices.upsertCompletePercentage({
				create: { ...body, user: { connect: { id: userId } } },
				update: body,
				where: { userId },
			});
			return res.status(StatusCodes.CREATED).json(returnVal(settings));
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

	public findMyCompletePercentage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyCompletePercentage");
		const { userId } = req;

		try {
			const settings = await this.settingsServices.findCompletePercentage({ where: { userId } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Complete percentage not found.",
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

	public findCompletePercentage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findCompletePercentage");
		const { id } = req.params;

		try {
			const settings = await this.settingsServices.findCompletePercentage({ where: { id: Number(id) } });

			if (settings) {
				return res.status(StatusCodes.OK).json(returnVal(settings));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Complete percentage not found.",
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

	public deleteMyCompletePercentage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyCompletePercentage");
		const { userId } = req;

		try {
			await this.settingsServices.deleteCompletePercentage({ where: { userId } });

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

	public deleteCompletePercentage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteCompletePercentage");
		const { id } = req.params;

		try {
			await this.settingsServices.deleteCompletePercentage({ where: { id: Number(id) } });

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

	public resolveSharing = async (
		req: Request<{ subdomain: string }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] resolveSharing");

		const { subdomain } = req.params;

		try {
			if (subdomain) {
				const settings = await this.settingsServices.findBusinessInfo({
					where: { link: subdomain },
					include: {
						user: { select: { ...this.userSelect, plans: true } },
					},
				});
				if (settings) {
					return res.status(StatusCodes.OK).json(returnVal(settings));
				} else {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(returnVal({ message: `Subdomain "${subdomain}" does not exist` }));
				}
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.ValidationError,
						status: StatusCodes.BAD_REQUEST,
						description: "No subdomain provided.",
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
}

const settingsController: SettingsController = new SettingsController();

export default settingsController;
