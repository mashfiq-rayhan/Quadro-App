/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "@providers/logger.provider";
import { responseObject } from "@src/providers/response.provider";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ClassDto, ClassOutput } from "./class.interfaces";
import { ClassParamsDto } from "./class.schema";
import * as classService from "./class.services";
import { ErrorCodes } from "../../errors/ErrorCodes";
import settingsServices from "../settings/settings.services";

export async function handelCreate(request: Request<{}, {}, ClassDto>, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo)
			return response
				.status(StatusCodes.UNAUTHORIZED)
				.json(responseObject("Please Complete you Onboarding", true));

		const newClass = await classService.createClass({ ...request.body, businessId: businessInfo.id });
		return response.status(StatusCodes.CREATED).json(responseObject(newClass));
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
		const updatedClass = await classService.updateClass(id, request.body);
		return response.status(StatusCodes.OK).json(responseObject(updatedClass));
	} catch (error: any) {
		return handelError(response, error);
	}
}

export async function handelGet(request: Request<ClassParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		console.log("ID :", id);
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
		const classList: Array<ClassOutput> = await classService.getAllClasss();
		return response.status(StatusCodes.OK).json(responseObject(classList));
	} catch (error) {
		return handelError(response, error);
	}
}
export async function handelGetAllByUser(request: Request, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		console.log(userId);
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(responseObject("UNAUTHORIZED", true));

		const classList: Array<ClassOutput> = await classService.getAllClasssByUser(Number(userId), businessInfo.id);
		return response.status(StatusCodes.OK).json(responseObject(classList));
	} catch (error) {
		return handelError(response, error);
	}
}

export async function handelGetAllByBusiness(request: Request, response: Response): Promise<Response> {
	try {
		const businessId = Number(request.params.id);
		if (!businessId) return response.status(StatusCodes.BAD_REQUEST).json(responseObject("Invalid Id", true));

		const businessInfo = await settingsServices.findBusinessInfo({ where: { id: businessId } });
		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(responseObject("UNAUTHORIZED", true));

		const classList: Array<ClassOutput> = await classService.getAllClasssByBusiness(businessInfo.id);

		return response.status(StatusCodes.OK).json(responseObject(classList));
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
