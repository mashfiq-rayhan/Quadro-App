import { Response, Request } from "express";
import * as appointmentService from "./appointment.services";
import log from "@providers/logger.provider";
import { AppointmentDto, AppointmentOutput } from "./appointment.interfaces";
import { responseObject } from "@src/providers/response.provider";
import { UpdateAppointmentDto } from "./appointment.schema";

export async function handelCreateAppointment(
	request: Request<{}, {}, AppointmentDto>,
	response: Response,
): Promise<Response> {
	try {
		const newAppointment = await appointmentService.createAppointments(request.body);
		return response.status(201).json(responseObject(newAppointment));
	} catch (error) {
		log.error(error);
		return response.status(500).json(responseObject(error, true));
	}
}

// export async function handelUpdateAppointment(
// 	request: Request<UpdateAppointmentDto>,
// 	response: Response,
// ): Promise<Response> {
// 	try {
// 		const id = request.params.id;
// 		const updatedAppointment = await appointmentService.updateAppointment(request.body);
// 		return response.status(200).json(responseObject(updatedAppointment));
// 	} catch (error) {
// 		log.error(error);
// 		return response.status(500).json(responseObject(error, true));
// 	}
// }

export async function handelGetAppointment(request: Request, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const newService = await appointmentService.getAppointmentById(id);
		return response.status(200).json({
			success: true,
			error: null,
			data: newService,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		log.error(error);
		if (error?.message === "Appointment Not found") {
			return response.status(400).json(responseObject({ code: 404, message: error?.message }, true));
		}
		return response
			.status(500)
			.json(responseObject({ code: 500, message: "Someting went wrong on our side" }, true));
	}
}

export async function getAllAppointment(_: Request, response: Response): Promise<Response> {
	try {
		const appointmentsList: Array<AppointmentOutput> = await appointmentService.getAllAppointments();
		return response.status(200).json(responseObject(appointmentsList));
	} catch (error) {
		log.error(error);
		return response
			.status(500)
			.json(responseObject({ code: 500, message: "Someting went wrong on our side" }, true));
	}
}
