/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentStatus } from "@prisma/client";
import log from "@providers/logger.provider";
import { handleResponse } from "@src/common/handler/response.handler";
import handleError from "@src/errors/handleError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { OrderDocument, OrderDto } from "./order.interface";
import { OrderParamsDto, OrderQueryDto } from "./order.schema";
import orderService from "./order.services";

async function handelCreate(request: Request<{}, OrderQueryDto, OrderDto>, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		if (!(await orderService.checkAvailability(request.body.serviceId)))
			return response.status(StatusCodes.NOT_ACCEPTABLE).json(handleResponse(" The Class Limit is Full ", true));
		const newOrder = await orderService.createOrder({
			...request.body,
			clientId: Number(userId),
		});

		return response.status(StatusCodes.CREATED).json(handleResponse(newOrder));
	} catch (error) {
		log.error(error);
		return handleError(response, error);
	}
}

export async function handelUpdate(
	request: Request<OrderParamsDto, {}, OrderDto>,
	response: Response,
): Promise<Response> {
	try {
		const id = request.params.id;
		const { userId } = request;

		const updatedOrder = await orderService.updateOrder(id, {
			...request.body,
			clientId: Number(userId),
		});

		return response.status(StatusCodes.OK).json(handleResponse(updatedOrder));
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGet(request: Request<OrderParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const { userId } = request;
		const targetOrder = await orderService.getOrderById(id, Number(userId));
		return response.status(StatusCodes.OK).json({
			success: true,
			error: null,
			data: targetOrder,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGetAllByUser(request: Request, response: Response): Promise<Response> {
	try {
		const userId = Number(request.userId);
		const client = request.query?.client;
		let OrdersList: Array<OrderDocument>;
		if (client) OrdersList = await orderService.getAllOrdersByUserId(userId, true);
		else OrdersList = await orderService.getAllOrdersByUserId(userId);
		return response.status(StatusCodes.OK).json(handleResponse(OrdersList));
	} catch (error) {
		return handleError(response, error);
	}
}

async function handelUpdateOrderStatus(request: Request, response: Response): Promise<Response> {
	try {
		const userId = Number(request.userId);
		const orderId = String(request.params.id);
		const updateTo: string = String(request.body.status);
		const updatedOrder = await orderService.updateOrderStatus(
			orderId,
			userId,
			PaymentStatus[updateTo.toUpperCase()],
		);
		return response.status(StatusCodes.OK).json(handleResponse(updatedOrder));
	} catch (error) {
		return handleError(response, error);
	}
}

export async function handleDelete(request: Request<OrderParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const userId = Number(request.userId);
		await orderService.deleteOrder(id, userId);
		return response.status(StatusCodes.NO_CONTENT).json(handleResponse("OK"));
	} catch (error: any) {
		return handleError(response, error);
	}
}

async function handelGetAllByClient(request: Request<OrderParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = Number(request.params.id);
		const userId = Number(request.userId);
		const orderList = await orderService.getAllOrdersByUsersClient(id, userId);
		return response.status(StatusCodes.OK).json(handleResponse(orderList));
	} catch (error: any) {
		return handleError(response, error);
	}
}

const orderController = {
	handelCreate,
	handelUpdate,
	handelGet,
	handelGetAllByUser,
	handelGetAllByClient,
	handelUpdateOrderStatus,
	handleDelete,
};

export default orderController;
