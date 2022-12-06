import { PaymentStatus, ServiceType } from "@prisma/client";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import servicesService from "@src/modules/service/service/service.services";

import bookingService from "../booking/booking.services";
import orderDal from "./order.dal";
import { OrderDocument, OrderOutput, OrderServiceDto } from "./order.interface";
import orderMapper from "./order.mapper";

async function createOrder(payload: OrderServiceDto): Promise<OrderOutput> {
	const booking = await bookingService.createBooking(payload);

	const order = await orderDal.create(orderMapper.toOrderInput(payload.clientId, booking));
	return orderMapper.toOrderOutput(order, booking);
}

async function getOrderById(id: string, userId: number): Promise<OrderOutput> {
	const order = await orderDal.getByIdAndValidate(id, userId);
	const booking = await bookingService.getBookingbyId(order.bookingId);
	return orderMapper.toOrderOutput(order, booking);
}

async function getAllOrdersByUserId(id: number, client: boolean = false): Promise<Array<OrderDocument>> {
	let orderList: OrderDocument[];
	if (client) orderList = await orderDal.getAllByClient(id);
	else orderList = await orderDal.getAllByUser(id);

	return orderList;
}

async function getAllOrdersByUsersClient(clientId: number, userId: number): Promise<Array<OrderDocument>> {
	const ordersList = await orderDal.getAllByUsersClient(clientId, userId);
	return ordersList;
}

async function updateOrder(id: string, payload: OrderServiceDto): Promise<OrderOutput> {
	const orderDetails = await getOrderById(id, payload.clientId);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { booking, ...order } = orderDetails;
	const updatedBooking = await bookingService.updateBooking(order.bookingId, payload);
	return orderMapper.toOrderOutput(order, updatedBooking);
}

async function updateOrderStatus(id: string, userId: number, status: PaymentStatus): Promise<OrderDocument> {
	if (status === PaymentStatus.CANCELED) {
		await bookingService.cancleBooking(id, userId);
	} else {
		const isAuthorized = await orderDal.chekcAuthorization(id, userId);
		if (!isAuthorized) throw Error(ErrorCodes.Unauthorized + " Your Unauthorized for this action ");
	}
	const updatedOrder = await orderDal.updateStatus(id, status);
	return updatedOrder;
}

async function deleteOrder(orderId: string, userId: number): Promise<void> {
	const isAuthorized = await orderDal.chekcAuthorization(orderId, userId);
	if (!isAuthorized) throw Error(ErrorCodes.Unauthorized + " Your Unauthorized for this action ");
	await orderDal.deleteOrder(orderId, userId);
	await bookingService.deleteBooking(orderId, userId);
}

async function checkAvailability(serviceId: string): Promise<boolean> {
	const serviceDetails = await servicesService.getServiceByTypeId(serviceId);
	const orderCount = await orderDal.orderCount(serviceDetails.id);
	if (serviceDetails.serviceType === ServiceType.CLASS && serviceDetails.class) {
		if (orderCount >= serviceDetails.class?.maxNumberOfParticipants) return false;
	}
	return true;
}

const orderService = {
	createOrder,
	updateOrder,
	getOrderById,
	getAllOrdersByUserId,
	updateOrderStatus,
	deleteOrder,
	getAllOrdersByUsersClient,
	checkAvailability,
};

export default orderService;
