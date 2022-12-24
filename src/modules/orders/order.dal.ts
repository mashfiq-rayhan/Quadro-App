import { PaymentStatus } from "@prisma/client";
import prisma from "@providers/prisma.provider";

import { ErrorCodes } from "../../errors/ErrorCodes";
import { OrderDocument, OrderInput } from "./order.interface";

async function create(payload: OrderInput): Promise<OrderDocument> {
	const newOrder = await prisma.order.create({
		data: {
			paymentStatus: payload.paymentStatus,
			client: {
				connect: { id: payload.clientId },
			},
			business: {
				connect: { id: payload.businessId },
			},
			booking: {
				connect: { id: payload.bookingId },
			},
		},
	});
	return newOrder;
}

async function orderCount(serviceId: number): Promise<number> {
	const count = await prisma.order.count({
		where: {
			booking: {
				AND: [{ serviceId }, { active: true }],
			},
		},
	});
	return count;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function update(id: number, payload: OrderInput): Promise<OrderDocument> {
	const updatedOrder = await prisma.order.update({
		where: {
			id: id,
		},
		data: {
			paymentStatus: payload.paymentStatus,
		},
	});
	return updatedOrder;
}

async function getById(id: number): Promise<boolean> {
	const order = await prisma.order.findFirst({
		where: { id: id },
	});
	if (!order) throw Error(ErrorCodes.NotFound + " : No order found with id : " + id);
	return true;
}

async function getByIdAndValidate(id: number, userId: number): Promise<OrderDocument> {
	const order = await prisma.order.findFirst({
		where: {
			AND: [
				{ id: id },
				{
					OR: [
						{ clientId: userId },
						{
							business: {
								userId: userId,
							},
						},
					],
				},
			],
		},
	});
	if (!order) throw Error(ErrorCodes.NotFound + " : No order found with id : " + id);
	return order;
}

async function getAllByUser(id: number): Promise<Array<OrderDocument>> {
	const order = await prisma.order.findMany({
		where: {
			business: {
				user: {
					id: id,
				},
			},
		},
		include: {
			booking: {
				select: {
					service: true,
					bookingTime: true,
					bookingType: true,
					location: true,
					note: true,
				},
			},
		},
	});
	return order;
}

async function getAllByClient(id: number): Promise<Array<OrderDocument>> {
	const order = await prisma.order.findMany({
		where: {
			clientId: id,
		},
		include: {
			booking: {
				select: {
					service: true,
					bookingTime: true,
					bookingType: true,
					location: true,
					note: true,
				},
			},
		},
	});
	return order;
}

async function chekcAuthorization(orderId: number, userId: number): Promise<boolean> {
	await getById(orderId);
	const isAuthenticated = await prisma.order.findFirst({
		where: {
			AND: [
				{ id: orderId },
				{
					business: {
						userId: userId,
					},
				},
			],
		},
	});
	if (!isAuthenticated) return false;
	return true;
}

async function updateStatus(orderId: number, payload: PaymentStatus): Promise<OrderDocument> {
	const updatedOrder = await prisma.order.update({
		where: {
			id: orderId,
		},
		data: {
			paymentStatus: payload,
		},
	});
	return updatedOrder;
}

async function deleteOrder(id: number, userId: number): Promise<void> {
	const isAuthorized = chekcAuthorization(id, userId);
	if (!isAuthorized) throw Error(ErrorCodes.Unauthorized + " : your Not Authorized for this action");
	await prisma.order.delete({
		where: {
			id,
		},
	});
}

async function getAllByUsersClient(clientId: number, userId: number): Promise<Array<OrderDocument>> {
	const data = await prisma.order.findMany({
		where: {
			AND: [
				{ clientId },
				{
					business: {
						userId,
					},
				},
			],
		},
		include: {
			booking: {
				select: {
					service: true,
					bookingTime: true,
					bookingType: true,
					location: true,
					note: true,
				},
			},
		},
	});
	return data;
}

async function orderAnalytics(startDate: string, endDate: string): Promise<Array<OrderDocument>> {
	const tottalRevenue = await prisma.order.findMany({
		where: {
			AND: [
				{
					createdAt: {
						lte: endDate,
						gt: startDate,
					},
				},
			],
		},
		include: {
			booking: {
				select: {
					service: true,
					bookingTime: true,
					bookingType: true,
					location: true,
					note: true,
				},
			},
		},
	});
	return tottalRevenue;
}

const orderDal = {
	create,
	getById,
	getAllByUser,
	getAllByClient,
	chekcAuthorization,
	updateStatus,
	getByIdAndValidate,
	deleteOrder,
	getAllByUsersClient,
	orderCount,
	orderAnalytics,
};
export default orderDal;
