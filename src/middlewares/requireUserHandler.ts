import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { ErrorCodes } from "../errors/ErrorCodes";
import { StatusCodes } from "http-status-codes";

/**
 *
 * Handle logged-in user required for the route
 *
 * @returns void
 */
const requireUserHandler = (req: Request, res: Response, next: NextFunction): void => {
	const { userId } = req;
	console.log({
		userId,
	});
	if (!userId) {
		return next(
			new CustomError({
				code: ErrorCodes.Unauthorized,
				status: StatusCodes.UNAUTHORIZED,
				description: `Not authorized to perform this action.`,
			}),
		);
	}
	next();
};

export default requireUserHandler;
