import { Order, User } from "@prisma/client";

import { BookingDto, BookingOutput } from "../booking/booking.interface";
import { CreateOrderDto } from "./order.schema";

export interface OrderInput extends Omit<Order, "id" | "createdAt" | "updatedAt"> {}

export interface OrderDocument extends Order {
	booking?: Omit<BookingOutput, "id">;
}

export interface OrderOutput extends OrderDocument {
	booking: BookingOutput;
}

export interface OrderDto extends CreateOrderDto, BookingDto {}

export type OrderServiceDto = OrderDto & {
	clientId: User["id"];
};

// serviceId: string;
// bookingTime: string;
// note?: string;
// bookingType: string;
