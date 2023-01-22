import { CreateAppointmentDto } from "./appointment.schema";
import {
	Appointment,
	Service,
	BusinessInfoSetting,
	ServiceType,
	PaymentType,
	LocationTypes,
	Image,
	ImageOnService,
} from "@prisma/client";
import { ServiceInput } from "../service/service.interface";

export interface AppointmentInput extends Omit<Appointment, "id" | "createdAt" | "updatedAt" | "serviceId"> {
	service: ServiceInput;
}

interface Images extends ImageOnService {
	image: Image;
}

export type AppointmentDocument = Appointment & {
	service: Service & {
		images: Array<Images>;
	};
};

export interface AppointmentDto extends Omit<CreateAppointmentDto, "location"> {
	depositAmount?: number;
	description?: string;
	published?: boolean;
	location: number;
	images: Array<string>;
}

export interface AppointmentServiceDto extends AppointmentDto {
	businessId: BusinessInfoSetting["id"];
	serviceType: ServiceType;
	images: Array<string>;
}

export interface AppointmentOutput extends Omit<AppointmentDocument, "service">, Omit<Service, "id" | "paymentType"> {
	paymentAcceptType: PaymentType;
	images: Array<Images>;
}
