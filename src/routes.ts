import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import authRoutes from "@modules/auth/auth.routes";
import usersRouter from "@modules/users/user.routes";
import { apiVersion } from "@utils/consts";
import appointmentRouter from "./modules/appointment/appointment.routes";
import classRouter from "./modules/classService/class.routes";
import settingsRoutes from "./modules/settings/settings.routes";
class RootRoutes {
	public router: Router;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes(): void {
		this.router.get("/", (_, res) => res.status(StatusCodes.OK).send(`Express SaaS app. API version V1.`));

		// Health check
		this.router.get("/health", (_, res) => res.status(StatusCodes.OK).send("OK"));

		// Test global error handling
		this.router.get("/error", (_, res) => {
			throw new Error("Raise some error.");

			res.status(StatusCodes.OK).send(`API version ${apiVersion}`);
		});

		// Module apis
		this.router.use(`${apiVersion}/auth`, authRoutes);
		this.router.use(`${apiVersion}/users`, usersRouter);
		this.router.use(`${apiVersion}/services/appointments`, appointmentRouter);
		this.router.use(`${apiVersion}/services/class`, classRouter);
		this.router.use(`${apiVersion}/settings`, settingsRoutes);

		// Catch all unmatched routes
		this.router.all("*", (_, res) => res.status(StatusCodes.NOT_FOUND).send("Route not found"));
	}
}

const rootRoutes: RootRoutes = new RootRoutes();

export default rootRoutes.router;
