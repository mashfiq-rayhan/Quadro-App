import { Router } from "express";
import { validateResource } from "@src/middlewares";
import * as orderController from "./order.controllers";
import requireUserHandler from "@src/middlewares/requireUserHandler";
import { createOrderSchema } from "./order.schema";

const orderRouter: Router = Router();

orderRouter.get("/health", (_, res) => res.status(200).send("Appointment router OK"));

orderRouter.get("/", orderController.handelGetAll);

orderRouter.get("/all-my-orders", [requireUserHandler], orderController.handelGetAllByUser);

orderRouter.get("/business/:id", orderController.handelGetAllByBusiness);

orderRouter.get("/:id", [requireUserHandler], orderController.handelGet);

orderRouter.post("/", [requireUserHandler, validateResource(createOrderSchema)], orderController.handelCreate);

orderRouter.put("/:id", [requireUserHandler, validateResource(createOrderSchema)], orderController.handelUpdate);

orderRouter.delete("/:id", [requireUserHandler], orderController.handleDelete);

export default orderRouter;
