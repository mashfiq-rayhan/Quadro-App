import { CreateAppointmentDto } from "./appointment.schema";
import { Appointment, Service } from "@prisma/client";
import { ServiceInput } from "@src/common/types/serviceInformation.types";

export interface AppointmentInput {
	paymentAcceptType: string;
	duration: number;
	published?: boolean;
	depositAmount?: number;
	service: ServiceInput;
}

export type AppointmentDocument = Appointment & {
	service: Service;
};

export interface AppointmentDto extends CreateAppointmentDto {
	depositAmount?: number;
	description?: string;
	published?: boolean;
}

export interface AppointmentOutput extends Omit<AppointmentDocument, "service" | "serviceId">, Omit<Service, "id"> {}
