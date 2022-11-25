import { Order, PaymentStatus } from "@prisma/client";

export interface OrderInput extends Omit<Order, "id" | "bookingId"> {}

export interface OrderDocument extends Order {}

export interface OrderOutput extends OrderDocument {}
