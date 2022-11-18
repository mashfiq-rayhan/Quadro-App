import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserDto } from "./user.schema";
import usersService, { UsersService } from "./user.services";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";

export class UsersController {
	private usersService: UsersService = usersService;

	public createNewUser = async (
		req: Request<{}, {}, CreateUserDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createNewUser");
		const body = req.body;

		const existingUser = await this.usersService.findUserByEmail(body.email);
		if (existingUser) {
			return next(
				new CustomError({
					code: ErrorCodes.UsernameExists,
					status: StatusCodes.CONFLICT,
					description: `User already exists with username ${body.email}.`,
				}),
			);
		}

		try {
			const user = await this.usersService.createUser(body);
			return res.status(201).json(user);
		} catch (error: any) {
			if (error.code === 11000) {
				return next(
					new CustomError({
						code: ErrorCodes.EmailExists,
						status: StatusCodes.CONFLICT,
						description: `User already exists with email ${body.email}.`,
					}),
				);
			} else {
				return next(error);
			}
		}
	};
}

const usersController: UsersController = new UsersController();

export default usersController;
