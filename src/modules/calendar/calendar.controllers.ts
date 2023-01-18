import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import calendarServices, { CalendarServices } from "@modules/calendar/calendar.services";
import userServices, { UserServices } from "@modules/users/user.services";
import {
	CalendarCreateDto,
	CalendarDeleteParamsDto,
	RemoveParticipantBodyDto,
	RemoveParticipantParamsDto,
	UpdateParticipantInCalendarBodyDto,
	UpdateParticipantInCalendarParamsDto,
} from "@modules/calendar/calendar.schemas";
import { PlanUpdateParamsDto } from "@modules/plan/plan.schemas";
import { returnVal } from "@utils/return";

export class CalendarControllers {
	private userServices: UserServices = userServices;
	private calendarServices: CalendarServices = calendarServices;

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

	public createCalendar = async (
		req: Request<{}, {}, CalendarCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createCalendar");

		const body = req.body;
		const { userId } = req;
		const { classId, appointmentId, blockId, participantIds, id, ...rest } = body;

		const idLength = [classId, blockId, appointmentId].filter((v) => v).length;
		if (idLength < 1)
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.BAD_REQUEST,
					description: "Any one of the class or booking or appointment id must be provided.",
				}),
			);
		if (idLength > 1)
			return next(
				new CustomError({
					code: ErrorCodes.CrudError,
					status: StatusCodes.BAD_REQUEST,
					description: "Only one of the class or booking or appointment id can be provided.",
				}),
			);

		try {
			const calendar = await this.calendarServices.upsertCalendar({
				create: {
					...rest,
					class: classId ? { connect: { id: classId } } : undefined,
					appointment: appointmentId ? { connect: { id: appointmentId } } : undefined,
					block: blockId ? { connect: { id: blockId } } : undefined,
					user: { connect: { id: userId } },
					participants: participantIds?.length
						? {
								create: participantIds.map((p) => ({
									client: { connect: { id: p } },
								})),
						  }
						: undefined,
				},
				update: {
					...rest,
					class: classId ? { connect: { id: classId } } : { disconnect: true },
					appointment: appointmentId ? { connect: { id: appointmentId } } : { disconnect: true },
					block: blockId ? { connect: { id: blockId } } : { disconnect: true },
					participants: participantIds?.length
						? {
								connectOrCreate: participantIds.map((p) => ({
									where: {
										clientId_calendarId: { clientId: Number(p), calendarId: id ? Number(id) : 0 },
									},
									create: {
										client: { connect: { id: Number(p) } },
									},
								})),
						  }
						: undefined,
				},
				where: { id: id ? id : 0 },
			});

			return res.status(StatusCodes.CREATED).json(returnVal(calendar));
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

	public createBlockWithCalendar = async (
		req: Request<{}, {}, Omit<CalendarCreateDto, "classId" | "appointmentId" | "blockId">>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createBlockWithCalendar");

		const body = req.body;
		const { userId } = req;
		const { participantIds, id, ...rest } = body;

		try {
			const calendar = await this.calendarServices.upsertCalendar({
				create: {
					...rest,
					user: { connect: { id: userId } },
					block: { create: { startDate: rest.startDate, endDate: rest.endDate, notes: rest.notes } },
					participants: participantIds?.length
						? {
								create: participantIds.map((p) => ({
									client: { connect: { id: p } },
								})),
						  }
						: undefined,
				},
				update: {
					...rest,
					block: {
						update: { startDate: rest.startDate, endDate: rest.endDate, notes: rest.notes },
						create: { startDate: rest.startDate, endDate: rest.endDate, notes: rest.notes },
					},
					participants: participantIds?.length
						? {
								connectOrCreate: participantIds.map((p) => ({
									where: {
										clientId_calendarId: { clientId: Number(p), calendarId: id ? Number(id) : 0 },
									},
									create: {
										client: { connect: { id: Number(p) } },
									},
								})),
						  }
						: undefined,
				},
				where: { id: id ? id : 0 },
			});

			return res.status(StatusCodes.CREATED).json(returnVal(calendar));
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

	public updatePaymentCalendar = async (
		req: Request<UpdateParticipantInCalendarParamsDto, {}, UpdateParticipantInCalendarBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] updatePaymentCalendar");

		const body = req.body;
		const { clientId, calendarId } = req.params;

		try {
			const calendar = await this.calendarServices.updateClientCalendar({
				where: { clientId_calendarId: { clientId: Number(clientId), calendarId: Number(calendarId) } },
				data: { hasPaid: body.hasPaid },
			});
			return res.status(StatusCodes.OK).json(returnVal(calendar));
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

			if (e?.code === "P2003") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: "Foreign key constraint failed on the field: `calendarId`.",
					}),
				);
			}

			if (e?.code === "P2014") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description:
							"The change you are trying to make would violate the required relation 'CalendarToClientsOnCalendars' between the `Calendar` and `ClientsOnCalendars` models.",
					}),
				);
			}

			if (e?.code === "P2017") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description:
							"The records for relation `CalendarToClientsOnCalendars` between the `Calendar` and `ClientsOnCalendars` models are not connected.",
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

	public removeParticipantFromCalendar = async (
		req: Request<RemoveParticipantParamsDto, {}, RemoveParticipantBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] removeParticipantFromCalendar");

		const body = req.body;
		const { id } = req.params;

		try {
			await this.calendarServices.deleteParticipants({
				where: {
					calendarId: Number(id),
					clientId: { in: body.participantIds },
				},
			});
			return res.status(StatusCodes.NO_CONTENT).json();
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

			if (e?.code === "P2003") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: "Foreign key constraint failed on the field: `calendarId`.",
					}),
				);
			}

			if (e?.code === "P2014") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description:
							"The change you are trying to make would violate the required relation 'CalendarToClientsOnCalendars' between the `Calendar` and `ClientsOnCalendars` models.",
					}),
				);
			}

			if (e?.code === "P2017") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description:
							"The records for relation `CalendarToClientsOnCalendars` between the `Calendar` and `ClientsOnCalendars` models are not connected.",
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

	public getCalendarParticipants = async (
		req: Request<{ id?: number }, {}, {}, { hasPaid: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getCalendarParticipants");
		const { id } = req.params;
		const { hasPaid } = req.query;

		try {
			const calendar = await calendarServices.findCalendar({
				where: { id: Number(id) },
				select: {
					participants: { include: { client: true }, where: { hasPaid } },
				},
			});

			if (calendar) {
				return res.status(StatusCodes.OK).json(returnVal(calendar));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
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

	public findCalendar = async (
		req: Request<
			{ id: number },
			{},
			{},
			{ hasUser: boolean; hasAppointment: boolean; hasClass: boolean; hasBlock: boolean; hasParticipant: boolean }
		>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findCalendar");
		const { id } = req.params;
		const { hasUser, hasAppointment, hasClass, hasBlock, hasParticipant } = req.query;

		try {
			const calendar = await calendarServices.findCalendar({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					appointment: hasAppointment,
					class: hasClass,
					block: hasBlock,
					participants: hasParticipant,
				},
			});

			if (calendar) {
				return res.status(StatusCodes.OK).json(returnVal(calendar));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
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

	public findMyCalendar = async (
		req: Request<
			PlanUpdateParamsDto,
			{},
			{},
			{ hasUser: boolean; hasAppointment: boolean; hasClass: boolean; hasBlock: boolean; hasParticipant: boolean }
		>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findMyCalendar");
		const { userId } = req;
		const { id } = req.params;
		const { hasUser, hasAppointment, hasClass, hasBlock, hasParticipant } = req.query;

		try {
			const calendar = await calendarServices.findCalendar({
				where: { id: Number(id) },
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					appointment: hasAppointment,
					class: hasClass,
					block: hasBlock,
					participants: hasParticipant,
				},
			});

			if (calendar && calendar.userId !== userId) {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
					}),
				);
			}

			if (calendar) {
				return res.status(StatusCodes.OK).json(returnVal(calendar));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
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

	public getCalendars = async (
		req: Request<
			{},
			{},
			{},
			{
				hasUser: boolean;
				hasAppointment: boolean;
				hasClass: boolean;
				hasBlock: boolean;
				hasParticipant: boolean;
				hasCancelled: boolean;
				hasRefunded: boolean;
				startDate: Date;
				endDate: Date;
				userId: number;
			}
		>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getCalendars");
		const {
			hasUser,
			hasAppointment,
			hasClass,
			hasBlock,
			hasParticipant,
			hasCancelled,
			hasRefunded,
			startDate,
			endDate,
			userId,
		} = req.query;

		const startOfStartDate = new Date(startDate);
		startOfStartDate.setUTCHours(0, 0, 0, 0);

		const endOfStartDate = new Date(startDate);
		endOfStartDate.setUTCHours(23, 59, 59, 999);

		const startOfEndDate = new Date(endDate);
		startOfEndDate.setUTCHours(0, 0, 0, 0);

		const endOfEndDate = new Date(endDate);
		endOfEndDate.setUTCHours(23, 59, 59, 999);

		try {
			const calendars = await calendarServices.getCalendars({
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					appointment: hasAppointment,
					class: hasClass,
					block: hasBlock,
					participants: hasParticipant,
				},
				where: {
					startDate: startDate ? { gte: startOfStartDate, lte: endOfStartDate } : undefined,
					endDate: endDate ? { gte: startOfEndDate, lte: endOfEndDate } : undefined,
					userId: userId ? Number(userId) : undefined,
					hasCancelled,
					hasRefunded,
				},
			});

			if (calendars) {
				return res.status(StatusCodes.OK).json(returnVal(calendars));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
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

	public getMyCalendars = async (
		req: Request<
			{},
			{},
			{},
			{
				hasUser: boolean;
				hasAppointment: boolean;
				hasClass: boolean;
				hasBlock: boolean;
				hasParticipant: boolean;
				hasCancelled: boolean;
				hasRefunded: boolean;
				startDate: Date;
				endDate: Date;
			}
		>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getMyCalendars");
		const { userId } = req;
		const {
			hasUser,
			hasAppointment,
			hasClass,
			hasBlock,
			hasParticipant,
			hasRefunded,
			hasCancelled,
			startDate,
			endDate,
		} = req.query;

		const startOfStartDate = new Date(startDate);
		startOfStartDate.setUTCHours(0, 0, 0, 0);

		const endOfStartDate = new Date(startDate);
		endOfStartDate.setUTCHours(23, 59, 59, 999);

		const startOfEndDate = new Date(endDate);
		startOfEndDate.setUTCHours(0, 0, 0, 0);

		const endOfEndDate = new Date(endDate);
		endOfEndDate.setUTCHours(23, 59, 59, 999);

		try {
			const calendars = await calendarServices.getCalendars({
				where: {
					userId,
					startDate: startDate ? { gte: startOfStartDate, lte: endOfStartDate } : undefined,
					endDate: endDate ? { gte: startOfEndDate, lte: endOfEndDate } : undefined,
					hasCancelled,
					hasRefunded,
				},
				include: {
					user: hasUser ? { select: this.userSelect } : false,
					appointment: hasAppointment,
					class: hasClass,
					block: hasBlock,
					participants: hasParticipant,
				},
			});

			if (calendars) {
				return res.status(StatusCodes.OK).json(returnVal(calendars));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Calendar not found.",
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

	public deleteCalendar = async (
		req: Request<CalendarDeleteParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteCalendar");
		const { id } = req.params;

		try {
			await calendarServices.deleteCalendar({ where: { id: Number(id) } });

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

	public deleteMyCalendar = async (
		req: Request<CalendarDeleteParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteMyCalendar");
		const { id } = req.params;

		try {
			await calendarServices.deleteCalendar({ where: { id: Number(id) } });

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

export default new CalendarControllers();
