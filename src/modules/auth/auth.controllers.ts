import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import log from "@providers/logger.provider";
import usersService, { UsersService } from "@modules/users/user.services";
import { LoginDto } from "./auth.schema";
import authService, { AuthServices } from "./auth.services";
import { UserDoc } from "@modules/users/user.schema";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";

export class AuthController {
	private usersService: UsersService = usersService;
	private authService: AuthServices = authService;

	public protectedRoute = async (req: Request, res: Response): Promise<Response> => {
		return res.status(200).send("Protected route");
	};

	public authenticateUser = async (
		req: Request<{}, {}, LoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		log.info("[controller] authenticateUser");

		const body = req.body;

		// Find user by email
		const user = await this.usersService.findUserByEmail(body.email);

		if (!user) {
			log.error("[error] user not found");
			return next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: `User not found with email ${body.email}.`,
				}),
			);
		}

		if (user && !user.verified) {
			log.error("[error] user not verified");
			return next(
				new CustomError({
					code: ErrorCodes.VerificationError,
					status: StatusCodes.BAD_REQUEST,
					description: "User not verified. Please check your email.",
				}),
			);
		}

		// Verify password
		const isValid = await this.usersService.verifyUserPassword(user.password, body.password);

		if (!isValid) {
			log.error("[error] Invalid credentials");
			return next(
				new CustomError({
					code: ErrorCodes.AuthError,
					status: StatusCodes.BAD_REQUEST,
					description: "Invalid credentials.",
				}),
			);
		}

		const minutes = 20;
		const accessToken = this.authService.signAccessToken(user?.toJSON(), minutes);
		const refreshToken = await this.authService.signRefreshToken(user);

		log.info("[success] Access and refresh token generated");

		res.cookie("accessToken", accessToken, {
			maxAge: minutes * 60 * 1000, // minutes in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});
		res.cookie("refreshToken", refreshToken, {
			maxAge: 3.154e10, // 1 year in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});

		return res.status(200).json({
			accessToken,
			refreshToken,
			expiresIn: `${minutes} m`,
		});
	};

	public authenticateGoogleUser = async (req, res, next): Promise<Response> => {
		log.info("[controller] authenticateGoogleUser");

		const user: UserDoc = req.user;

		if (!user) {
			log.error("[error] user not found");
			return next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: "User not found.",
				}),
			);
		}

		const minutes = 20;
		const accessToken = this.authService.signAccessToken(user?.toJSON(), minutes);
		const refreshToken = await this.authService.signRefreshToken(user);

		log.info("[success] Access and refresh token generated");

		res.cookie("accessToken", accessToken, {
			maxAge: minutes * 60 * 1000, // minutes in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});
		res.cookie("refreshToken", refreshToken, {
			maxAge: 3.154e10, // 1 year in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});

		return res.status(200).json({
			accessToken,
			refreshToken,
			expiresIn: `${minutes} m`,
		});
	};

	public getCurrentUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void | CustomError> => {
		const { userId } = req;

		try {
			if (userId) {
				const user = await this.usersService.findUserById(userId);
				if (user) return res.status(200).send(user.toJSON());
				else
					return next(
						new CustomError({
							code: ErrorCodes.NotFound,
							status: StatusCodes.NOT_FOUND,
							description: "User not found.",
						}),
					);
			}
		} catch (err) {
			return next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: "User not found.",
				}),
			);
		}
	};

	public refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		const refreshToken = get(req.headers, "x-refresh-token") as string;

		if (!refreshToken)
			return next(
				new CustomError({
					code: ErrorCodes.JwtError,
					status: StatusCodes.BAD_REQUEST,
					description: "Refresh token not found in header.",
				}),
			);

		const decoded = await this.authService.verifyToken<{ session: string; iat: number }>(
			refreshToken,
			"refresh_token_public_key",
		);

		if (!decoded)
			return next(
				new CustomError({
					code: ErrorCodes.JwtError,
					status: StatusCodes.UNAUTHORIZED,
					description: "Invalid refresh token.",
				}),
			);

		const session = await this.authService.findSessionById(decoded.session);

		if (!session || !session.valid)
			return next(
				new CustomError({
					code: ErrorCodes.JwtError,
					status: StatusCodes.UNAUTHORIZED,
					description: "Invalid session.",
				}),
			);

		const user = await this.usersService.findUserById(String(session.user));

		if (!user)
			return next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: "Invalid user.",
				}),
			);

		const minutes = 20;
		const accessToken = this.authService.signAccessToken(user.toJSON(), minutes);

		log.info("[success] Access token generated");

		res.cookie("accessToken", accessToken, {
			maxAge: minutes * 60 * 1000, // minutes in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});

		return res.status(200).json({
			accessToken,
			expiresIn: `${minutes} m`,
		});
	};
}

const authController: AuthController = new AuthController();

export default authController;
