/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "@providers/logger.provider";
import { responseObject } from "@src/providers/response.provider";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ClassDto, ClassOutput } from "./class.interfaces";
import { ClassParamsDto } from "./class.schema";
import * as classService from "./class.services";
import { ErrorCodes } from "../../errors/ErrorCodes";

export async function handelCreate(request: Request<{}, {}, ClassDto>, response: Response): Promise<Response> {
	try {
		// console.log(request.body);
		const newAppointment = await classService.createClass(request.body);
		return response.status(StatusCodes.CREATED).json(responseObject(newAppointment));
	} catch (error) {
		log.error(error);
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseObject(error, true));
	}
}

export async function handelUpdate(
	request: Request<ClassParamsDto, {}, ClassDto>,
	response: Response,
): Promise<Response> {
	try {
		const id = request.params.id;
		const updatedAppointment = await classService.updateClass(id, request.body);
		return response.status(StatusCodes.OK).json(responseObject(updatedAppointment));
	} catch (error: any) {
		return handelError(response, error);
	}
}

export async function handelGet(request: Request<ClassParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const newService = await classService.getClassById(id);
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
		const appointmentsList: Array<ClassOutput> = await classService.getAllClasss();
		return response.status(StatusCodes.OK).json(responseObject(appointmentsList));
	} catch (error) {
		return handelError(response, error);
	}
}

export async function handleDelete(request: Request<ClassParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		await classService.deleteClass(id);
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
