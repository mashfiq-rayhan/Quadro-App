import { Socket } from "socket.io";
import { ISocket } from "@common/types/socket.types";
import log from "@providers/logger.provider";
import authService from "@modules/auth/auth.services";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import { StatusCodes } from "http-status-codes";

export class AuthSocket implements ISocket {
	public handleConnection = (socket: Socket): void => {
		log.info("[auth] Socket connected");
		log.info("[socket] connection id: " + socket.id);
		// log.info(socket.handshake)
		socket.emit("auth_ping", { message: "Welcome to the auth socket" });

		socket.on("client_ping", (data: string) => {
			log.info("[socket] Client pinged");
			log.info(data);
		});
	};

	public middlewareImplementation = async (socket: Socket, next: (e?: Error) => void): Promise<void> => {
		// Implement middleware for auth here
		const auth_header = socket.handshake.headers.authorization;

		if (auth_header) {
			const payload = authService.verifyToken<{ session: number; iat: number }>(
				auth_header,
				"access_token_public_key",
			);
			if (!payload) {
				log.error("[socket] Not authorized");
				socket.disconnect();
				return next(
					new CustomError({
						code: ErrorCodes.Unauthorized,
						status: StatusCodes.UNAUTHORIZED,
						description: "Not authorized.",
					}),
				);
			}

			const session = await authService.findSessionById(payload?.session!);
			if (!session || !session.valid) {
				log.error("[socket] Invalid session");
				socket.disconnect();
				return next(
					new CustomError({
						code: ErrorCodes.JwtError,
						status: StatusCodes.UNAUTHORIZED,
						description: "Invalid session.",
					}),
				);
			}

			return next();
		} else {
			log.error("[socket] Authorization header not found");
			socket.disconnect();
			return next(
				new CustomError({
					code: ErrorCodes.AuthError,
					status: StatusCodes.BAD_REQUEST,
					description: "Authorization header not found.",
				}),
			);
		}
	};
}

const authSocket = new AuthSocket();

export default authSocket;
