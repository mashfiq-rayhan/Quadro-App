import dotenv from "dotenv";
dotenv.config(); // Must be loaded before other imports
import express, { Application } from "express";
import "module-alias/register";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import boolParser from "express-query-boolean";
import config from "config";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import log from "@providers/logger.provider";
import router from "./routes";
import { errorHandler } from "@middlewares/.";
import passportAuth from "@modules/auth/passport/auth.config";
import { createServer, Server } from "http";
import { Websocket } from "./socket";
import authSocket from "@modules/auth/auth.socket";
import { SOCKET_PATHS } from "@common/const/socket.const";
import { IJwtPayload } from "@common/types/jwt.types";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";

import { ErrorArgs } from "@src/errors/ErrorArgs";

import tokenHandler from "@middlewares/tokenHandler";

class App {
	public app: Application;
	public server: Server;
	public io: Websocket;
	public port: number | string;

	public constructor() {
		this.app = express();
		this.server = createServer(this.app);
		this.io = Websocket.getInstance(this.server);
		this.port = config.get<number>("port");

		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeHelmet();
		this.initializeErrorHandling();
		this.initializeSocketHandlers();
	}

	public listen = (): void => {
		// We are now listening server instead of app
		this.server.listen(this.port, () => {
			log.info(`=========================================`);
			log.info(`Server started on port ${this.port}`);
			log.info(`=========================================`);
		});
	};

	private initializeDatabaseConnections = async (): Promise<void> => {};

	private initializeMiddlewares = (): void => {
		this.app.use(express.json());
		this.app.use(bodyParser.json());
		this.app.use(boolParser());
		this.app.use(express.urlencoded({ extended: false }));
		// Enable CORS
		this.app.use(
			cors({
				origin: "*",
			}),
		);
		this.app.use(hpp());
		this.app.use(compression());
		this.app.use(cookieParser());
		// Initialize passport
		this.app.use(passport.initialize());
		passportAuth(passport);
		this.app.use(tokenHandler);
	};

	private initializeHelmet = (): void => {
		this.app.use(helmet());
	};

	private initializeRoutes = (): void => {
		this.app.use(router);
	};

	private initializeErrorHandling = (): void => {
		// Intentional routes for global error handling
		this.app.get("/unknown-error", (_, res, next) => {
			next(new Error("Something wrong happened! Please try again later."));
		});

		this.app.get("/known-error", (_, res, next) => {
			next(
				new CustomError({
					code: ErrorCodes.NotFound,
					status: StatusCodes.NOT_FOUND,
					description: "Not found - raise known error.",
				}),
			);
		});

		// Error handler. Must be placed at the end of the middleware chain.
		this.app.use(errorHandler);

		// Catch all unmatched routes
		this.app.all("*", (req, res) =>
			res.status(StatusCodes.NOT_FOUND).json({
				code: ErrorCodes.NotFound,
				status: StatusCodes.NOT_FOUND,
				description: "Route not found!",
				metaData: {
					path: req.path,
					method: req.method,
				},
			} as ErrorArgs),
		);
	};

	private initializeSocketHandlers = (): void => {
		this.io.initializeHandlers([{ path: `/${SOCKET_PATHS.AUTH}`, handler: authSocket }]);
	};
}

const app = new App();
app.listen();

// Extend global express request object
declare global {
	namespace Express {
		export interface Request {
			userId?: number;
			jwt?: IJwtPayload;
		}
	}
}
