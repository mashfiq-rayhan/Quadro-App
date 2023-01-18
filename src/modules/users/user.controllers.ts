import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserDto } from "./user.schema";
import log from "@providers/logger.provider";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import userServices, { UserServices } from "@modules/users/user.services";
import { returnVal } from "@utils/return";

export class UsersController {
	private userServices: UserServices = userServices;

	public createNewUser = async (
		req: Request<{}, {}, CreateUserDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] createNewUser");
		const body = req.body;

		const existingUser = await this.userServices.findUserByEmail(body.email);
		console.log("existing users", existingUser);
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
			const user = await this.userServices.createUser(body);
			return res.status(201).json(returnVal(user));
		} catch (error: any) {
			console.log(error);
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
