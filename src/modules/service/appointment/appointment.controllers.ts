/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceType } from "@prisma/client";
import log from "@providers/logger.provider";
import { handleResponse } from "@src/common/handler/response.handler";
import handleError from "@src/errors/handleError";
import settingsServices from "@src/modules/settings/settings.services";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getBusiness } from "../common/business.services";
import { AppointmentDto, AppointmentOutput } from "./appointment.interfaces";
import { AppointmentParamsDto } from "./appointment.schema";
import appointmentService from "./appointment.services";

async function handelCreate(request: Request<{}, {}, AppointmentDto>, response: Response): Promise<Response | void> {
	try {
		const businessInfo = await getBusiness(request.userId);
		const newAppointment = await appointmentService.createAppointment({
			...request.body,
			businessId: Number(businessInfo.id),
			serviceType: ServiceType.APPOINTMENT,
		});
		return response.status(StatusCodes.CREATED).json(handleResponse(newAppointment));
	} catch (error) {
		log.error(error);
		return handleError(response, error);
	}
}

async function handelUpdate(
	request: Request<AppointmentParamsDto, {}, AppointmentDto>,
	response: Response,
): Promise<Response> {
	try {
		const id = Number(request.params.id);

		const businessInfo = await getBusiness(request.userId);

		const updatedAppointment = await appointmentService.updateAppointment(id, {
			...request.body,
			businessId: Number(businessInfo.id),
			serviceType: ServiceType.APPOINTMENT,
		});

		return response.status(StatusCodes.OK).json(handleResponse(updatedAppointment));
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGet(request: Request<AppointmentParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = Number(request.params.id);
		const newService = await appointmentService.getAppointmentById(id);
		return response.status(StatusCodes.OK).json({
			success: true,
			error: null,
			data: newService,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGetAll(request: Request, response: Response): Promise<Response> {
	try {
		const appointmentsList: Array<AppointmentOutput> = await appointmentService.getAllAppointments();
		return response.status(StatusCodes.OK).json(handleResponse(appointmentsList));
	} catch (error) {
		return handleError(response, error);
	}
}

async function handelGetAllByUser(request: Request, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(handleResponse("UNAUTHORIZED", true));

		const appointmentsList: Array<AppointmentOutput> = await appointmentService.getAllAppointmentsByUser(
			Number(userId),
			businessInfo.id,
		);
		return response.status(StatusCodes.OK).json(handleResponse(appointmentsList));
	} catch (error) {
		return handleError(response, error);
	}
}

async function handelGetAllByBusiness(request: Request, response: Response): Promise<Response> {
	try {
		const businessId = Number(request.params.id);
		if (!businessId) return response.status(StatusCodes.BAD_REQUEST).json(handleResponse("Invalid Id", true));

		const businessInfo = await settingsServices.findBusinessInfo({ where: { id: businessId } });
		if (!businessInfo)
			return response.status(StatusCodes.NOT_FOUND).json(handleResponse("Invalid Business ID", true));

		const appointmentsList: Array<AppointmentOutput> = await appointmentService.getAllAppointmentsByBusiness(
			businessInfo.id,
		);

		return response.status(StatusCodes.OK).json(handleResponse(appointmentsList));
	} catch (error) {
		return handleError(response, error);
	}
}

async function handleDelete(request: Request<AppointmentParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = Number(request.params.id);
		await appointmentService.deleteAppointment(id);
		return response.status(StatusCodes.NO_CONTENT).json(handleResponse("OK"));
	} catch (error: any) {
		return handleError(response, error);
	}
}

const appointmentController = {
	handelCreate,
	handelUpdate,
	handelGet,
	handelGetAll,
	handelGetAllByUser,
	handelGetAllByBusiness,
	handleDelete,
};

export default appointmentController;
