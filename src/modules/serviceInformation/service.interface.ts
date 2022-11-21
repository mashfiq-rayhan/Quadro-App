import { Types } from "mongoose";
import { CreateServiceDto } from "./service.schema";

export interface ServiceInput {
	name: string;
	description?: string;
	location: string;
	price: number;
}

export interface ServiceDocument extends Required<ServiceInput> {
	_id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface ServiceOutput extends Omit<ServiceDocument, "createdAt" | "updatedAt"> {}

export interface ServiceDto extends CreateServiceDto {
	description?: string;
}

export type ServiceID = string | Types.ObjectId;
