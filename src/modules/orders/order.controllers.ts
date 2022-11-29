/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "@providers/logger.provider";
import { responseObject } from "@src/providers/response.provider";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderDto, OrderOutput } from "./order.interface";
import { OrderParamsDto } from "./order.schema";
import * as OrderService from "./order.services";
import { ErrorCodes } from "../../errors/ErrorCodes";
import settingsServices from "../settings/settings.services";

export async function handelCreate(request: Request<{}, {}, OrderDto>, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo)
			return response
				.status(StatusCodes.UNAUTHORIZED)
				.json(responseObject("Please Complete you Onboarding", true));

		const newOrder = await OrderService.createOrder({
			...request.body,
			businessId: Number(businessInfo.id),
		});

		return response.status(StatusCodes.CREATED).json(responseObject(newOrder));
	} catch (error) {
		log.error(error);
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseObject(error, true));
	}
}

export async function handelUpdate(
	request: Request<OrderParamsDto, {}, OrderDto>,
	response: Response,
): Promise<Response> {
	try {
		const id = request.params.id;

		const { userId } = request;
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });
		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(responseObject("UNAUTHORIZED", true));

		const updatedOrder = await OrderService.updateOrder(id, {
			...request.body,
			businessId: Number(businessInfo.id),
		});

		return response.status(StatusCodes.OK).json(responseObject(updatedOrder));
	} catch (error: any) {
		return handelError(response, error);
	}
}

export async function handelGet(request: Request<OrderParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		const newService = await OrderService.getOrderById(id);
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

export async function handelGetAll(request: Request, response: Response): Promise<Response> {
	try {
		const OrdersList: Array<OrderOutput> = await OrderService.getAllOrders();
		return response.status(StatusCodes.OK).json(responseObject(OrdersList));
	} catch (error) {
		return handelError(response, error);
	}
}

export async function handelGetAllByUser(request: Request, response: Response): Promise<Response> {
	try {
		const { userId } = request;
		const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });

		if (!businessInfo) return response.status(StatusCodes.UNAUTHORIZED).json(responseObject("UNAUTHORIZED", true));

		const OrdersList: Array<OrderOutput> = await OrderService.getAllOrdersByUser(Number(userId), businessInfo.id);
		return response.status(StatusCodes.OK).json(responseObject(OrdersList));
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

		const OrdersList: Array<OrderOutput> = await OrderService.getAllOrdersByBusiness(businessInfo.id);

		return response.status(StatusCodes.OK).json(responseObject(OrdersList));
	} catch (error) {
		return handelError(response, error);
	}
}

export async function handleDelete(request: Request<OrderParamsDto, {}, {}>, response: Response): Promise<Response> {
	try {
		const id = request.params.id;
		await OrderService.deleteOrder(id);
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
