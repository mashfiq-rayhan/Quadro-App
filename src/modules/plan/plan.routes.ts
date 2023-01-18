import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import planController, { PlanControllers } from "@modules/plan/plan.controllers";
import requireUserHandler from "@middlewares/requireUserHandler";

class PlanRouter {
	public router: Router;
	private planController: PlanControllers = planController;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(StatusCodes.OK).send("Plan router OK"));

		this.router.post("/", [requireUserHandler], this.planController.createPlan);

		this.router.get("/my", [requireUserHandler], this.planController.getMyPlans);

		this.router.get("/", this.planController.getPlans);

		this.router.put("/:id", [requireUserHandler], this.planController.updatePlan);

		this.router.get("/:id", this.planController.findPlan);

		this.router.get("/my/:id", [requireUserHandler], this.planController.findMyPlan);

		this.router.delete("/:id", this.planController.deletePlan);

		this.router.delete("/my/:id", [requireUserHandler], this.planController.deleteMyPlan);
	};
}

export default new PlanRouter().router;
