import { returnVal } from "@utils/return";
import blockServices, { BlockServices } from "./block.services";
import { NextFunction, Request, Response } from "express";
import log from "@providers/logger.provider";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import { BlockCreateDto, BlockUpdateBodyDto, BlockUpdateParamsDto } from "@modules/block/block.schemas";

export class BlockControllers {
	private blockServices: BlockServices = blockServices;

	public createBlock = async (
		req: Request<{}, {}, BlockCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createBlock");

		const body = req.body;

		try {
			const block = await this.blockServices.createBlock({
				data: body,
			});

			return res.status(StatusCodes.CREATED).json(returnVal(block));
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

	public updateBlock = async (
		req: Request<BlockUpdateParamsDto, {}, BlockUpdateBodyDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] updateBlock");

		const body = req.body;
		const { id } = req.params;

		try {
			const block = await this.blockServices.updateBlock({
				data: body,
				where: { id },
			});

			return res.status(StatusCodes.CREATED).json(returnVal(block));
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

	public findBlock = async (
		req: Request<BlockUpdateParamsDto, {}, {}, { hasCalendar: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] findBlock");

		const { id } = req.params;
		const { hasCalendar } = req.query;

		try {
			const block = await this.blockServices.findBlock({
				where: { id },
				include: { Calendar: hasCalendar },
			});

			if (block) {
				return res.status(StatusCodes.CREATED).json(returnVal(block));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Block not found.",
					}),
				);
			}
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

	public getBlocks = async (
		req: Request<{}, {}, {}, { hasCalendar: boolean }>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] getBlocks");

		const { hasCalendar } = req.query;

		try {
			const block = await this.blockServices.getBlocks({
				include: { Calendar: hasCalendar },
			});

			if (block) {
				return res.status(StatusCodes.CREATED).json(returnVal(block));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.NotFound,
						status: StatusCodes.NOT_FOUND,
						description: "Block not found.",
					}),
				);
			}
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

	public deleteBlock = async (
		req: Request<BlockUpdateParamsDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] deleteBlock");
		const { id } = req.params;

		try {
			await blockServices.deleteBlock({ where: { id } });

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

export default new BlockControllers();
