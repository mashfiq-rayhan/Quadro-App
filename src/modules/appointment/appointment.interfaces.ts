import { Types } from "mongoose";
import { ServiceOutput } from "../serviceInformation/service.interface";
import { CreateAppointmentDto } from "./appointment.schema";

export interface CheckoutInfo {
	type: string;
	deposit?: number;
}

// TODO change basic info to serviceId
export interface AppointmentInput {
	serviceId: Types.ObjectId;
	checkoutInfo: CheckoutInfo;
	duration: number;
	published: boolean;
	active?: boolean;
}

export interface AppointmentDocument extends Required<AppointmentInput> {
	_id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface AppointmentDto extends CreateAppointmentDto {
	serviceId: Types.ObjectId;
	depositAmount?: number;
	description?: string;
	published?: boolean;
}

export interface AppointmentOutput
	extends Omit<AppointmentDocument, "active" | "serviceId" | "checkoutInfo">,
		Omit<ServiceOutput, "_id" | "createdAt" | "updatedAt"> {
	description: string;
	paymentAcceptType: string;
	depositAmount: number;
}

export type AppointmentID = string | Types.ObjectId;
