import { Booking, BookingType, Service } from "@prisma/client";
import { CreateBookingDto } from "./booking.schema";

export interface BookingInput extends Omit<Booking, "id" | "createdAt" | "updatedAt" | "active"> {}

export interface BookingDocument extends Booking {
	service: Service;
}

export interface BookingOutput extends BookingDocument {
	service: Service;
}

export interface BookingDto extends CreateBookingDto {
	note: string;
}
