import { CreateAppointmentDto } from "./appointment.schema";
import { Appointment, Service, BusinessInfoSetting } from "@prisma/client";
import { ServiceInput } from "@src/common/types/serviceInformation.types";

export interface AppointmentInput {
	paymentAcceptType: string;
	duration: number;
	published?: boolean;
	depositAmount?: number;
	service: ServiceInput;
	businessId: BusinessInfoSetting["id"];
}

export type AppointmentDocument = Appointment & {
	service: Service;
};

export interface AppointmentDto extends CreateAppointmentDto {
	depositAmount?: number;
	description?: string;
	published?: boolean;
	businessId: BusinessInfoSetting["id"];
}

export interface AppointmentOutput
	extends Omit<AppointmentDocument, "service" | "serviceId" | "business" | "businessId">,
		Omit<Service, "id"> {}
