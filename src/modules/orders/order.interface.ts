import { Order, PaymentStatus } from "@prisma/client";
import { CreateOrderDto } from "./order.schema";
import { CreateBookingDto } from "../booking/booking.schema";

export interface OrderInput extends Omit<Order, "id" | "bookingId"> {}

export interface OrderDocument extends Order {}

export interface OrderOutput extends OrderDocument {}

export type OrderDto = CreateOrderDto & CreateBookingDto;
