import { CreateServiceDto } from "./service.schema";
import { Service, BusinessInfoSetting, ServiceType, PaymentType, Class, Appointment } from "@prisma/client";

export interface ServiceInput extends Omit<Service, "id"> {
	image: Array<string>;
}

export interface ServiceDto extends CreateServiceDto {
	description?: string;
	businessId: BusinessInfoSetting["id"];
	serviceType: ServiceType;
	paymentType?: PaymentType;
}

export interface ServiceDocument extends Service {
	queryId?: string;
	class?: Class;
	appointment?: Appointment;
}
export interface ServiceOutput extends ServiceDocument {}
