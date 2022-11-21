import { Types } from "mongoose";
import { ServiceOutput } from "../serviceInformation/service.interface";
import { CreateClassDto } from "./class.schema";

// TODO change basic info to serviceId
export interface ClassRepeatInput {
	week: number;
	monday: boolean;
	tuesday: boolean;
	wednesday: boolean;
	thursday: boolean;
	friday: boolean;
	saturday: boolean;
	sunday: boolean;
}

export interface ClassRepeatDto {
	week: number;
	days: Array<string>;
}

// FOR DB CHANGE
export interface ClassRepeatDocument extends Required<ClassRepeatInput> {
	_id: Types.ObjectId;
	classId: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

// TODO: ClassRepeatInput to Object Id after DB Change
export interface ClassInput {
	serviceId: Types.ObjectId;
	maxNumberOfParticipants: number;
	duration?: number;
	classRepeatId?: ClassRepeatInput;
	startDateAndTime?: Date;
	endDate?: Date;
	published?: boolean;
	active?: boolean;
}

export interface ClassDocument extends Required<ClassInput> {
	_id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface ClassDto extends CreateClassDto {
	serviceId: Types.ObjectId;
	startDateAndTime: Date;
	repeat: ClassRepeatDto;
	endDate: Date;
	duration: number;
	description?: string;
	published?: boolean;
}

export interface ClassOutput
	extends Omit<ClassDocument, "active" | "classRepeatId" | "serviceId">,
		Omit<ServiceOutput, "_id" | "createdAt" | "updatedAt"> {
	description: string;
	repeat: ClassRepeatDto;
}

export type ClassID = string | Types.ObjectId;
