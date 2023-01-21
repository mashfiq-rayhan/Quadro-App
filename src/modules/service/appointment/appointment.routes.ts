import { Router } from "express";
import { createAppointmentSchema, appointmentParamsSchema, updateAppointmentSchema } from "./appointment.schema";
import { validateResource } from "@src/middlewares";
import appointmentController from "./appointment.controllers";
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
				location: `enum default : empty BUSINESS |  accepted values : [ CLIENT ,BUSINESS, ONLINE ] `,
				description: `string (optional) default : empty string `,
				price: "number",
				paymentAcceptType: "string",
				depositAmount: "number (optional) defaultL 0",
				duration: "number ",
				published: "boolean (optional) default : false",
				images: ` array of string(url) optional `,
			},
		},
	}),
);

appointmentRouter.get("/", appointmentController.handelGetAll);

appointmentRouter.get("/all-my-appointments", [requireUserHandler], appointmentController.handelGetAllByUser);

appointmentRouter.get("/business/:id", appointmentController.handelGetAllByBusiness);

appointmentRouter.get("/:id", [validateResource(appointmentParamsSchema)], appointmentController.handelGet);

appointmentRouter.post(
	"/",
	[requireUserHandler, validateResource(createAppointmentSchema)],
	appointmentController.handelCreate,
);

appointmentRouter.put(
	"/:id",
	[requireUserHandler, validateResource(updateAppointmentSchema)],
	appointmentController.handelUpdate,
);

appointmentRouter.delete(
	"/:id",
	[requireUserHandler, validateResource(appointmentParamsSchema)],
	appointmentController.handleDelete,
);

export default appointmentRouter;
