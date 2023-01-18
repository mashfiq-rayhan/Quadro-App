import { Router } from "express";
import requireUserHandler from "@src/middlewares/requireUserHandler";
import serviceController from "./service.controllers";
const serviceRouter: Router = Router();

serviceRouter.get("/:id", serviceController.getServiceById);

export default serviceRouter;
