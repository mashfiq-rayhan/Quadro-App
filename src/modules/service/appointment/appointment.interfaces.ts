import { CreateAppointmentDto } from "./appointment.schema";
import { Appointment, Service, BusinessInfoSetting, ServiceType, PaymentType } from "@prisma/client";
import { ServiceInput } from "../service/service.interface";

export interface AppointmentInput extends Omit<Appointment, "id" | "createdAt" | "updatedAt" | "serviceId"> {
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

export interface AppointmentServiceDto extends AppointmentDto {
	businessId: BusinessInfoSetting["id"];
	serviceType: ServiceType;
}

export interface AppointmentOutput
	extends Omit<AppointmentDocument, "service" | "serviceId">,
		Omit<Service, "id" | "paymentType"> {
	paymentAcceptType: PaymentType;
}
