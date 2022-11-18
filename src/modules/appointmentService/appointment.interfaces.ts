import { Types } from "mongoose";
import { ServiceOutput } from "../services/service.interface";
import { CreateAppointmentDto } from "./appointment.schema";

export interface PriceInfo {
	type: string;
	price: number;
}

export interface CheckoutInfo {
	type: string;
	deposit?: number;
}

export interface Duration {
	hours: number;
	minutes: number;
}

export interface BlockedTime extends Duration {}

export interface AppointmentInput {
	basicInfo: Types.ObjectId;
	duration: number;
	timeBetweenSession: number;
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
	staffMembers?: Types.Array<string>;
	published?: boolean;
}

export interface AppointmentOutput
	extends Omit<AppointmentDocument, "active" | "basicInfo">,
		Omit<ServiceOutput, "_id" | "createdAt" | "updatedAt"> {
	description: string;
}
