import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import clientController, { ClientControllers } from "@modules/client/client.controllers";
import requireUserHandler from "@middlewares/requireUserHandler";

class ClientRouter {
	public router: Router;
	private clientController: ClientControllers = clientController;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(StatusCodes.OK).send("Client router OK"));

		this.router.post("/", [requireUserHandler], this.clientController.createClient);

		this.router.get("/my", [requireUserHandler], this.clientController.getMyClients);

		this.router.get("/", this.clientController.getClients);

		this.router.put("/:id", [requireUserHandler], this.clientController.updateClient);

		this.router.put("/remove-plan/:id", [requireUserHandler], this.clientController.removePlanFromClient);

		this.router.put(
			"/update-plan/:clientId/:planId",
			[requireUserHandler],
			this.clientController.updatePlanInClient,
		);

		this.router.get("/:id", this.clientController.findClient);

		this.router.delete("/:id", this.clientController.deleteClient);

		this.router.delete("/my/:id", [requireUserHandler], this.clientController.deleteMyClient);
	};
}

export default new ClientRouter().router;
