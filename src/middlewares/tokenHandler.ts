import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import log from "../providers/logger.provider";
import authService from "../modules/auth/auth.services";
import { IJwtPayload } from "../common/types/jwt.types";
import { CustomError } from "../errors/CustomError";
import { ErrorCodes } from "../errors/ErrorCodes";

/**
 *
 * Handle token and current logged-in user
 *
 * @returns void
 */
const tokenHandler = (req: Request, res: Response, next: NextFunction): void => {
	try {
		// Check if authorization header is found
		if (req.headers.authorization) {
			// Extract access token
			const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/i, "");
			if (!accessToken)
				return next(
					new CustomError({
						code: ErrorCodes.JwtError,
						status: StatusCodes.UNAUTHORIZED,
						description: "Access token not provided in header.",
					}),
				);

			// Verify access token
			const decoded = authService.verifyToken<IJwtPayload>(accessToken, "access_token_public_key");
			if (decoded) {
				// Extend in global req object
				// Type is declared in app
				req.userId = decoded.sub;
				req.jwt = decoded;
			}

			return next();
		} else return next();
	} catch (error: any) {
		log.error("[token] Token verification failed.");
		res.status(400).send(error.message);
		return next(
			new CustomError({
				code: ErrorCodes.JwtError,
				status: StatusCodes.BAD_REQUEST,
				description: error.message,
			}),
		);
	}
};

export default tokenHandler;
