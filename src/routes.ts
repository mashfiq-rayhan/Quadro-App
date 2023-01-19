import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import authRoutes from "@modules/auth/auth.routes";
import usersRouter from "@modules/users/user.routes";
import settingsRouter from "@modules/settings/settings.routes";
import { apiVersion } from "@utils/consts";

import planRouter from "./modules/plan/plan.routes";
import clientRouter from "./modules/client/client.routes";
import calendarRouter from "./modules/calendar/calendar.routes";
import fileRouter from "./modules/file/file.routes";
import servicesRouter from "./modules/service/service.routes";
import orderRouter from "./modules/orders/order.routes";
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
		this.router.use(`${apiVersion}/settings`, settingsRouter);
		this.router.use(`${apiVersion}/plans`, planRouter);
		this.router.use(`${apiVersion}/clients`, clientRouter);
		this.router.use(`${apiVersion}/calendar`, calendarRouter);
		this.router.use(`${apiVersion}/files`, fileRouter);
		this.router.use(`${apiVersion}/services`, servicesRouter);
		this.router.use(`${apiVersion}/orders`, orderRouter);
		// Catch all unmatched routes
		this.router.all("*", (_, res) => res.status(StatusCodes.NOT_FOUND).send("Route not found"));
	}
}

const rootRoutes: RootRoutes = new RootRoutes();

export default rootRoutes.router;
