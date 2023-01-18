import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import planServices, { PlanServices } from "@modules/plan/plan.services";
import userServices, { UserServices } from "@modules/users/user.services";
import { PlanCreateDto, PlanUpdateBodyDto, PlanUpdateParamsDto } from "@modules/plan/plan.schemas";
import { returnVal } from "@utils/return";

export class PlanControllers {
	private userServices: UserServices = userServices;
	private planServices: PlanServices = planServices;

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

	public createPlan = async (
		req: Request<{}, {}, PlanCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] upsertPlan");

		const body = req.body;
		const { userId } = req;

		try {
			const plan = await this.planServices.createPlan({
				data: {
					...body,
					user: { connect: { id: userId } },
					services: body.services?.length
						? {
								create: body.services.map((s) => ({
									service: { connect: { id: s } },
									assignedBy: { connect: { id: userId } },
								})),
						  }
						: undefined,
				},
			});

			return res.status(StatusCodes.CREATED).json(plan);
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

			if (e?.code === "P2002") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.BAD_REQUEST,
						description: `Unique constraint failed on the constraint: ${e?.meta?.target}`,
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

	public updatePlan = async (
		req: Request<PlanUpdateParamsDto, {}, PlanUpdateBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] updatePlan");

		const body = req.body;
		const { userId } = req;
		const { id } = req.params;

		try {
			const plan = await this.planServices.updatePlan({
				data: {
					...body,
					services: body.services?.length
						? {
								connectOrCreate: body.services.map((s) => ({
									where: { serviceId_planId: { planId: Number(id), serviceId: Number(s) } },
									create: {
										service: { connect: { id: Number(s) } },
										assignedBy: { connect: { id: userId } },
									},
								})),
						  }
						: undefined,
				},
				where: { id: Number(id) },
			});

			return res.status(StatusCodes.CREATED).json(returnVal(plan));
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

			if (e?.code === "P2002") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.BAD_REQUEST,
						description: `Unique constraint failed on the constraint: ${e?.meta?.target}`,
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

	public findPlan = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasService: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findPlan");
		const { id } = req.params;
		const { hasUser, hasService } = req.query;

		try {
			const plan = await planServices.findPlan({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					services: hasService ? { include: { service: true } } : false,
				},
			});

			if (plan) {
				return res.status(StatusCodes.OK).json(returnVal(plan));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Plan not found.",
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

	public findMyPlan = async (
		req: Request<PlanUpdateParamsDto, {}, {}, { hasUser: boolean; hasService: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyPlan");
		const { userId } = req;
		const { id } = req.params;
		const { hasUser, hasService } = req.query;

		try {
			const plan = await planServices.findPlan({
				where: { userId, id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					services: hasService ? { include: { service: true } } : false,
				},
			});

			if (plan) {
				return res.status(StatusCodes.OK).json(returnVal(plan));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Plan not found.",
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

	public getPlans = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasService: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getPlans");
		const { hasUser, hasService } = req.query;

		try {
			const plans = await planServices.getPlans({
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					services: hasService ? { include: { service: true } } : false,
				},
			});

			if (plans) {
				return res.status(StatusCodes.OK).json(returnVal(plans));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Plan not found.",
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

	public getMyPlans = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasService: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getMyPlans");
		const { userId } = req;
		const { hasUser, hasService } = req.query;

		try {
			const plans = await planServices.getPlans({
				where: { userId },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					services: hasService ? { include: { service: true } } : false,
				},
			});

			if (plans) {
				return res.status(StatusCodes.OK).json(returnVal(plans));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Plan not found.",
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

	public deletePlan = async (
		req: Request<PlanUpdateParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deletePlan");
		const { id } = req.params;

		try {
			await planServices.deletePlan({ where: { id: Number(id) } });

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

	public deleteMyPlan = async (
		req: Request<PlanUpdateParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyPlan");
		const { id } = req.params;

		try {
			await planServices.deletePlan({ where: { id: Number(id) } });

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

export default new PlanControllers();
