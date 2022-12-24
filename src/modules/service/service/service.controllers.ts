import { handleResponse } from "@src/common/handler/response.handler";
import handleError from "@src/errors/handleError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import servicesService from "./service.services";

export async function getServiceById(request: Request, response: Response): Promise<Response> {
	try {
		const service = await servicesService.getServiceByTypeId(Number(request.params.id));
		return response.status(StatusCodes.OK).json(handleResponse(service));
	} catch (error) {
		return handleError(response, error);
	}
}

const serviceController = {
	getServiceById,
};

export default serviceController;
