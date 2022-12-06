import { PaymentStatus, ServiceType } from "@prisma/client";
import lodash from "lodash";
import { object, string, TypeOf } from "zod";

import { bookingSchema, bookingUpdateSchema } from "../booking/booking.schema";

// update with payment gateway
const orderSchema = object({});

export const orderQuerySchema = object({
	query: object({
		orderType: string({
			required_error: "No Order Type Provided",
		}),
	}).refine((data) => isValidQuery(data.orderType), {
		message: `Invalid query orderType , Possible Options : [ ${Object.keys(ServiceType)} ]`,
		path: ["orderType"],
	}),
});

const statusSchema = object({
	status: string({
		required_error: "status is required",
	}).refine((data) => isValidStatus(data), {
		message: `Invalid data status , Possible Options : [ ${Object.keys(PaymentStatus)} ]`,
		path: ["orderType"],
	}),
});

export const orderStatusUpdateSchema = object({
	body: statusSchema,
});

export const orderBodySchema = object({
	body: orderSchema.extend(bookingSchema.shape),
});
export const updateOrderSchema = object({
	body: orderSchema.extend(bookingUpdateSchema.shape),
});

export const createOrderSchema = orderBodySchema;

export const orderParamsSchema = object({
	params: object({
		id: string({
			required_error: "No Id Provided", // Arbitrary
		}),
	}),
});

function isValidQuery(type: string): boolean {
	if (lodash.has(ServiceType, type.toUpperCase())) return true;
	return false;
}

function isValidStatus(type: string): boolean {
	if (lodash.has(PaymentStatus, type.toUpperCase())) return true;
	return false;
}

export type OrderQueryDto = TypeOf<typeof orderQuerySchema>["query"];
export type OrderParamsDto = TypeOf<typeof orderParamsSchema>["params"];
export type CreateOrderDto = TypeOf<typeof orderBodySchema>;
