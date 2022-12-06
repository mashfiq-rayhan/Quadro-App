import { PaymentStatus, User } from "@prisma/client";

import { BookingOutput } from "../booking/booking.interface";
import { OrderDocument, OrderInput, OrderOutput } from "./order.interface";

function toOrderInput(clientId: User["id"], booking: BookingOutput): OrderInput {
	const order: OrderInput = {
		businessId: booking.service.businessId,
		clientId: clientId,
		paymentStatus: PaymentStatus.UNPAID,
		bookingId: booking.id,
	};

	return order;
}

function toOrderOutput(order: OrderDocument, booking: BookingOutput): OrderOutput {
	return {
		booking: booking,
		id: order.id,
		bookingId: order.bookingId,
		paymentStatus: order.paymentStatus,
		createdAt: order.createdAt,
		updatedAt: order.updatedAt,
		clientId: order.clientId,
		businessId: order.businessId,
	};
}

const orderMapper = {
	toOrderInput,
	toOrderOutput,
};

export default orderMapper;
