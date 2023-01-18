import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import planServices, { PlanServices } from "@modules/plan/plan.services";
import userServices, { UserServices } from "@modules/users/user.services";
import { PlanUpdateParamsDto } from "@modules/plan/plan.schemas";
import clientServices, { ClientServices } from "@modules/client/client.services";
import {
	ClientCreateDto,
	ClientUpdateBodyDto,
	ClientUpdateParamsDto,
	RemovePlanBodyDto,
	RemovePlanParamsDto,
	UpdatePlanInClientBodyDto,
	UpdatePlanInClientParamsDto,
} from "@modules/client/client.schemas";
import { returnVal } from "@utils/return";

export class ClientControllers {
	private userServices: UserServices = userServices;
	private planServices: PlanServices = planServices;
	private clientServices: ClientServices = clientServices;

	public createClient = async (
		req: Request<{}, {}, ClientCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createClient");

		const body = req.body;
		const { userId } = req;

		try {
			const client = await this.clientServices.createClient({
				data: {
					...body,
					assignedBy: { connect: { id: userId } },
				},
			});

			return res.status(StatusCodes.CREATED).json(returnVal(client));
		} catch (e: any) {
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

	public updateClient = async (
		req: Request<ClientUpdateParamsDto, {}, ClientUpdateBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] updateClient");

		const body = req.body;
		const { id } = req.params;
		const { userId } = req;

		try {
			const client = await this.clientServices.updateClient({
				data: {
					...body,
					plans: body.plans?.length
						? {
								connectOrCreate: body.plans.map((p) => ({
									where: { clientId_planId: { clientId: Number(id), planId: p } },
									create: { plan: { connect: { id: p } } },
								})),
						  }
						: undefined,
				},
				where: { id: Number(id) },
			});

			return res.status(StatusCodes.OK).json(returnVal(client));
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

	public removePlanFromClient = async (
		req: Request<RemovePlanParamsDto, {}, RemovePlanBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] removePlanFromClient");

		const body = req.body;
		const { id } = req.params;

		try {
			const client = await this.clientServices.updateClient({
				data: {
					plans: body.plans?.length
						? {
								delete: body.plans.map((p) => ({
									clientId_planId: { clientId: Number(id), planId: p },
								})),
						  }
						: undefined,
				},
				where: { id: Number(id) },
				select: {
					plans: { include: { plan: true } },
				},
			});

			return res.status(StatusCodes.OK).json(returnVal(client));
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

			if (e?.code === "P2017") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description:
							"The records for relation `ClientToClientsOnPlans` between the `Client` and `ClientsOnPlans` models are not connected.",
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

	public updatePlanInClient = async (
		req: Request<UpdatePlanInClientParamsDto, {}, UpdatePlanInClientBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] updatePlanInClient");

		const body = req.body;
		const { clientId, planId } = req.params;

		try {
			const client = await this.clientServices.updateClient({
				data: {
					plans: {
						update: {
							where: { clientId_planId: { clientId: Number(clientId), planId: Number(planId) } },
							data: { hasPaid: body.hasPaid },
						},
					},
				},
				where: { id: Number(clientId) },
			});

			return res.status(StatusCodes.OK).json(returnVal(client));
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

	public findClient = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findClient");
		const { id } = req.params;
		const { hasUser, hasPlan } = req.query;

		try {
			const client = await clientServices.findClient({
				where: { id: Number(id) },
				include: {
					plans: hasPlan ? { include: { plan: true } } : false,
				},
			});

			if (client) {
				return res.status(StatusCodes.OK).json(returnVal(client));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Client not found.",
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

	public findMyClient = async (
		req: Request<{ id: number }, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findClient");
		const { id } = req.params;
		const { userId } = req;
		const { hasUser, hasPlan } = req.query;

		try {
			const client = await clientServices.findClient({
				where: { id: Number(id), assignedBy: { id: userId } },
				include: {
					plans: hasPlan ? { include: { plan: true } } : false,
				},
			});

			if (client) {
				return res.status(StatusCodes.OK).json(returnVal(client));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Client not found.",
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

	public getClients = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getClients");
		const { hasUser, hasPlan } = req.query;

		try {
			const clients = await clientServices.getClients({
				include: {
					plans: hasPlan ? { include: { plan: true } } : false,
				},
			});

			if (clients) {
				return res.status(StatusCodes.OK).json(returnVal(clients));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Client not found.",
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

	public getMyClients = async (
		req: Request<{}, {}, {}, { hasUser: boolean; hasPlan: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getMyClients");
		const { userId } = req;
		const { hasUser, hasPlan } = req.query;

		try {
			const clients = await clientServices.getClients({
				where: { assignedBy: { id: userId } },
				include: {
					plans: hasPlan ? { include: { plan: true } } : false,
				},
			});

			if (clients) {
				return res.status(StatusCodes.OK).json(returnVal(clients));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Client not found.",
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

	public deleteClient = async (
		req: Request<ClientUpdateParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteClient");
		const { id } = req.params;

		try {
			await clientServices.deleteClient({ where: { id: Number(id) } });

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

	public deleteMyClient = async (
		req: Request<PlanUpdateParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyClient");
		const { id } = req.params;
		const { userId } = req;

		try {
			const client = await clientServices.findClient({
				where: { id: Number(id), assignedBy: { id: userId } },
			});
			console.log({ client });
			if (client) {
				await clientServices.deleteClient({ where: { id: client.id } });
				return res.status(StatusCodes.NO_CONTENT).json();
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Client not found.",
					}),
				);
			}
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

export default new ClientControllers();
