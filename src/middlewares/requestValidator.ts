import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { StatusCodes } from "http-status-codes";
import { MiddlewareType } from "../shared/types/app.types";
import log from "../providers/logger.provider";
import { CustomError } from "../errors/CustomError";
import { ErrorCodes } from "../errors/ErrorCodes";

/**
 *
 * Validate the request body, query and params by zod.
 *
 * @param schema - The schema to validate the request body against
 * @returns void
 */
const requestValidator =
	(schema: AnyZodObject): MiddlewareType =>
	(req: Request, res: Response, next: NextFunction): void => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			log.info("[validation] Schema validated.");
			next();
		} catch (error: any) {
			log.error("[validation] Schema validation failed.");
			next(
				new CustomError({
					code: ErrorCodes.ValidationError,
					status: StatusCodes.BAD_REQUEST,
					description: error.message,
				}),
			);
		}
	};

export default requestValidator;
