/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleResponse } from "@common/handler/response.handler";
import log from "@providers/logger.provider";
import handleError from "@src/errors/handleError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import settingsServices from "../../settings/settings.services";
import { getBusiness } from "../common/business.services";
import { ClassDto, ClassOutput } from "./class.interfaces";
import { ClassParamsDto } from "./class.schema";
import classService from "./class.services";

async function handelCreate(request: Request<{}, {}, ClassDto>, response: Response): Promise<Response> {
	try {
		const businessInfo = await getBusiness(request.userId);
		const newClass = await classService.createClass({ ...request.body, businessId: businessInfo.id });
		return response.status(StatusCodes.CREATED).json(handleResponse(newClass));
	} catch (error) {
		log.error(error);
		return handleError(response, error);
	}
}

async function handelUpdate(request: Request<ClassParamsDto, {}, ClassDto>, response: Response): Promise<Response> {
	try {
		const businessInfo = await getBusiness(request.userId);
		const id = Number(request.params.id);
		const updatedClass = await classService.updateClass(id, { ...request.body, businessId: businessInfo.id });
		return response.status(StatusCodes.OK).json(handleResponse(updatedClass));
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGet(request: Request<ClassParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = Number(request.params.id);
		console.log("ID :", id);
		const newService = await classService.getClassById(id);
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

async function handelGetAll(_: Request, response: Response): Promise<Response> {
	try {
		const classList: Array<ClassOutput> = await classService.getAllClasss();
		return response.status(StatusCodes.OK).json(handleResponse(classList));
	} catch (error) {
		return handleError(response, error);
	}
}
async function handelGetAllByUser(request: Request, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		console.log(userId);
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(handleResponse("UNAUTHORIZED", true));

		const classList: Array<ClassOutput> = await classService.getAllClasssByUser(Number(userId), businessInfo.id);
		return response.status(StatusCodes.OK).json(handleResponse(classList));
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

		const classList: Array<ClassOutput> = await classService.getAllClasssByBusiness(businessInfo.id);

		return response.status(StatusCodes.OK).json(handleResponse(classList));
	} catch (error) {
		return handleError(response, error);
	}
}

async function handleDelete(request: Request<ClassParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = Number(request.params.id);
		await classService.deleteClass(id);
		return response.status(StatusCodes.NO_CONTENT).json(handleResponse("OK"));
	} catch (error: any) {
		return handleError(response, error);
	}
}

const classController = {
	handelCreate,
	handelUpdate,
	handelGet,
	handelGetAll,
	handelGetAllByUser,
	handelGetAllByBusiness,
	handleDelete,
};
export default classController;
