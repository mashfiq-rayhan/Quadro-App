import { Router } from "express";
import { createAppointmentSchema, appointmentParamsSchema, updateAppointmentSchema } from "./appointment.schema";
import { validateResource } from "@src/middlewares";
import * as appointmentController from "./appointment.controllers";
import requireUserHandler from "@src/middlewares/requireUserHandler";

const appointmentRouter: Router = Router();

appointmentRouter.get("/health", (_, res) => res.status(200).send("Appointment router OK"));
appointmentRouter.get("/info", (_, res) =>
	res.status(200).send({
		success: true,
		error: null,
		data: {
			info: ` ------ Response object structure will be same as Request object `,
			expectedRequestObject: {
				name: "string",
				location: `string (optional) default : empty string `,
				description: `string (optional) default : empty string `,
				price: "number",
				paymentAcceptType: "string",
				depositAmount: "number (optional) defaultL 0",
				duration: "number ",
				published: "boolean (optional) default : false",
			},
		},
	}),
);

appointmentRouter.get("/", appointmentController.handelGetAll);

appointmentRouter.get("/auth-test", [requireUserHandler], (_, res) => res.status(200).send("Appointment router OK"));

appointmentRouter.get("/:id", [validateResource(appointmentParamsSchema)], appointmentController.handelGet);

appointmentRouter.post("/", [validateResource(createAppointmentSchema)], appointmentController.handelCreate);

appointmentRouter.put("/:id", [validateResource(updateAppointmentSchema)], appointmentController.handelUpdate);

appointmentRouter.delete("/:id", [validateResource(appointmentParamsSchema)], appointmentController.handleDelete);

export default appointmentRouter;
