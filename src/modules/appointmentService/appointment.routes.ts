import { Router } from "express";
import {  createAppointmentSchema, getAppointmentSchema } from "./appointment.schema";
import { createServiceSchema } from "../services/service.schema";
import { validateResource } from "@src/middlewares";
import * as appointmentController from "./appointment.controllers";

const appointmentRouter: Router = Router();

appointmentRouter.get("/health", (_, res) => res.status(200).send("Appointment router OK"));

appointmentRouter.get("/", appointmentController.getAllAppointment);

appointmentRouter.get("/:id", [validateResource(getAppointmentSchema)], appointmentController.handelGetAppointment);

appointmentRouter.post("/", [validateResource(createAppointmentSchema)], appointmentController.handelCreateAppointment);
// appointmentRouter.post(
// 	"/",
// 	[validateResource(createServiceSchema), validateResource(createAppointmentSchema)],
// 	appointmentController.handelCreateAppointment,
// );

appointmentRouter.put("/:id", (_, res) => res.status(200).send("Appointment router update OK"));

appointmentRouter.delete("/:id", (_, res) => res.status(200).send("Appointment router delete OK"));

export default appointmentRouter;
