import { validateResource } from "@src/middlewares";
import requireUserHandler from "@src/middlewares/requireUserHandler";
import { Router } from "express";

import orderController from "./order.controllers";
import { createOrderSchema, orderStatusUpdateSchema, updateOrderSchema } from "./order.schema";

const orderRouter: Router = Router();

orderRouter.get("/health", [requireUserHandler], (_, res) => res.status(200).send("Order router OK"));

orderRouter.get("/", [requireUserHandler], orderController.handelGetAllByUser);

orderRouter.get("/analytics", [requireUserHandler], orderController.handelAnalytics);

orderRouter.get("/client/:id", [requireUserHandler], orderController.handelGetAllByClient);

orderRouter.get("/:id", [requireUserHandler], orderController.handelGet);

orderRouter.post("/", [requireUserHandler, validateResource(createOrderSchema)], orderController.handelCreate);

orderRouter.put(
	"/status/:id",
	[requireUserHandler, validateResource(orderStatusUpdateSchema)],
	orderController.handelUpdateOrderStatus,
);

orderRouter.put("/:id", [requireUserHandler, validateResource(updateOrderSchema)], orderController.handelUpdate);

orderRouter.delete("/:id", [requireUserHandler], orderController.handleDelete);

export default orderRouter;
