import { NextFunction, Request, Response } from "express";
import log from "@providers/logger.provider";
import { gracefulErrorHandler } from "@src/errors/ErrorHandler";

/**
 *
 * If something goes wrong and not handled in respective place, this middleware will catch it.
 *
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
	log.error("[error] catch in global middleware.");
	log.info(`[error] Path: ${req.path}`);
	log.error(JSON.stringify(err));

	gracefulErrorHandler.handleError(err, res);
};

export default errorHandler;
