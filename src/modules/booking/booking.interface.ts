import { Booking, Service } from "@prisma/client";

import { CreateBookingDto } from "./booking.schema";

export interface BookingInput extends Omit<Booking, "id" | "createdAt" | "updatedAt" | "active"> {}

export interface BookingDocument extends Booking {
	service: Service;
}

export interface BookingOutput
	extends Omit<BookingDocument, "serviceId" | "service" | "active" | "createdAt" | "updatedAt"> {
	service: Omit<Service, "id">;
}

export interface BookingDto extends CreateBookingDto {
	note?: string;
	location: string;
	bookingType: string;
	bookingTime: string;
}
