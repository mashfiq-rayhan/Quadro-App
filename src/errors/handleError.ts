import { handleResponse } from "@src/common/handler/response.handler";
import log from "@src/providers/logger.provider";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

import { ErrorCodes } from "./ErrorCodes";

function handleError(response: Response, error: any): Response {
	log.error(error);

	if (_.includes(error?.message, ErrorCodes.NotFound)) {
		return response.status(StatusCodes.NOT_FOUND).json(
			handleResponse(
				{
					code: StatusCodes.NOT_FOUND,
					message: `${error?.message}`,
				},
				true,
			),
		);
	}
	if (_.includes(error?.message, ErrorCodes.Unauthorized)) {
		return response.status(StatusCodes.UNAUTHORIZED).json(
			handleResponse(
				{
					code: StatusCodes.UNAUTHORIZED,
					message: `${error?.message}`,
				},
				true,
			),
		);
	}

	return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
		handleResponse(
			{
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Someting went wrong on our side , Please Try again later",
			},
			true,
		),
	);
}

export default handleError;
