/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "@providers/logger.provider";
import { responseObject } from "@src/providers/response.provider";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppointmentDto, AppointmentOutput } from "./appointment.interfaces";
import { AppointmentParamsDto } from "./appointment.schema";
import * as appointmentService from "./appointment.services";
import { ErrorCodes } from "../../errors/ErrorCodes";

export async function handelCreate(request: Request<{}, {}, AppointmentDto>, response: Response): Promise<Response> {
	try {
		const newAppointment = await appointmentService.createAppointment(request.body);
		return response.status(StatusCodes.CREATED).json(responseObject(newAppointment));
	} catch (error) {
		log.error(error);
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseObject(error, true));
	}
}

export async function handelUpdate(
	request: Request<AppointmentParamsDto, {}, AppointmentDto>,
	response: Response,
): Promise<Response> {
	try {
		const id = request.params.id;
		const updatedAppointment = await appointmentService.updateAppointment(id, request.body);
		return response.status(StatusCodes.OK).json(responseObject(updatedAppointment));
	} catch (error: any) {
		return handelError(response, error);
	}
}

export async function handelGet(request: Request<AppointmentParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const newService = await appointmentService.getAppointmentById(id);
		return response.status(StatusCodes.OK).json({
			success: true,
			error: null,
			data: newService,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return handelError(response, error);
	}
}

export async function handelGetAll(_: Request, response: Response): Promise<Response> {
	try {
		const appointmentsList: Array<AppointmentOutput> = await appointmentService.getAllAppointments();
		return response.status(StatusCodes.OK).json(responseObject(appointmentsList));
	} catch (error) {
		return handelError(response, error);
	}
}

export async function handleDelete(
	request: Request<AppointmentParamsDto, {}, {}>,
	response: Response,
): Promise<Response> {
	try {
		const id = request.params.id;
		await appointmentService.deleteAppointment(id);
		return response.status(StatusCodes.NO_CONTENT).json(responseObject("OK"));
	} catch (error: any) {
		return handelError(response, error);
	}
}

function handelError(response: Response, error: any): Response {
	log.error(error);
	if (error?.message === ErrorCodes.NotFound) {
		return response.status(StatusCodes.NOT_FOUND).json(
			responseObject(
				{
					code: StatusCodes.NOT_FOUND,
					message: `${error} : No resource found with the provided ID`,
				},
				true,
			),
		);
	}
	return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
		responseObject(
			{
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Someting went wrong on our side , Please Try again later",
			},
			true,
		),
	);
}
