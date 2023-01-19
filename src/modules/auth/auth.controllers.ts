import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import log from "@providers/logger.provider";
import { LoginDto, UserUpdateDto } from "./auth.schema";
import { IUser } from "@modules/users/user.schema";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import userServices, { UserServices } from "@modules/users/user.services";
import authService, { AuthServices } from "@modules/auth/auth.services";
import settingsServices, { SettingsServices } from "@modules/settings/settings.services";
import { returnVal } from "@utils/return";

export class AuthController {
	private authService: AuthServices = authService;
	private userServices: UserServices = userServices;
	private settingsServices: SettingsServices = settingsServices;

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
		const user = await this.userServices.findUserByEmail(body.email);

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
		const isValid = await this.userServices.verifyUserPassword(user.password!, body.password);

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

		const settings = await this.settingsServices.findBusinessInfo({ where: { userId: user.id } });

		const minutes = 60 * 24 * 30 * 12;
		const accessToken = this.authService.signAccessToken(user, minutes);
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

		return res.status(200).json(
			returnVal({
				accessToken,
				refreshToken,
				expiresIn: `${minutes} m`,
				isOnboardingCompleted: !!settings,
				subdomain: settings ? settings.link : null,
			}),
		);
	};

	public authenticateGoogleUser = async (req, res, next): Promise<Response> => {
		log.info("[controller] authenticateGoogleUser");

		const user: IUser = req.user;

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

		const settings = await this.settingsServices.findBusinessInfo({ where: { userId: user.id } });

		const minutes = 60 * 24 * 30 * 12;
		const accessToken = this.authService.signAccessToken(user, minutes);
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

		return res.status(200).json(
			returnVal({
				accessToken,
				refreshToken,
				expiresIn: `${minutes} m`,
				isOnboardingCompleted: !!settings,
				subdomain: settings ? settings.link : null,
			}),
		);
	};

	public getCurrentUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void | CustomError> => {
		const { userId } = req;
		try {
			if (userId) {
				const user = await this.userServices.findOne({
					where: { id: userId },
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						profilePicture: true,
						utm_campaign: true,
						utm_source: true,
						utm_medium: true,
						utm_content: true,
						createdAt: true,
						updatedAt: true,
					},
				});
				if (user) return res.status(200).send(returnVal(user));
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

	public updateCurrentUser = async (
		req: Request<{}, {}, UserUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<Response | void | CustomError> => {
		const { userId } = req;
		const body = req.body;

		try {
			if (userId) {
				const user = await this.userServices.updateUser({
					where: { id: userId },
					data: body,
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						profilePicture: true,
						utm_campaign: true,
						utm_source: true,
						utm_medium: true,
						utm_content: true,
						createdAt: true,
						updatedAt: true,
					},
				});
				return res.status(200).send(returnVal(user));
			}
		} catch (err: any) {
			console.log(err);

			if (err?.code === "P2025") {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.NOT_FOUND,
						description: err?.meta?.cause,
					}),
				);
			}

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

		const decoded = await this.authService.verifyToken<{ session: number; iat: number }>(
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

		const user = await this.userServices.findUserById(session.userId);

		if (!user)
			return next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: "Invalid user.",
				}),
			);

		const minutes = 60 * 24 * 30 * 12;
		const accessToken = this.authService.signAccessToken(user, minutes);

		log.info("[success] Access token generated");

		res.cookie("accessToken", accessToken, {
			maxAge: minutes * 60 * 1000, // minutes in milliseconds
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: false,
		});

		return res.status(200).json(
			returnVal({
				accessToken,
				expiresIn: `${minutes} m`,
			}),
		);
	};
}

const authController: AuthController = new AuthController();

export default authController;
