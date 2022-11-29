import { CreateClassDto } from "./class.schema";
import { Class, Service, ClassRepeat, BusinessInfoSetting } from "@prisma/client";
import { ServiceInput } from "@src/common/types/serviceInformation.types";

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
	id: string;
	classId: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface ClassInput extends Omit<Class, "id" | "createdAt" | "updatedAt" | "serviceId" | "repeatId"> {
	service: ServiceInput;
	repeat: Omit<ClassRepeat, "id">;
}

export type ClassDocument = Class & {
	service: Service;
	repeat: ClassRepeat;
};

export interface ClassDto extends CreateClassDto {
	startDateAndTime: Date;
	repeat: ClassRepeatDto;
	endDate: Date;
	duration: number;
	description?: string;
	published?: boolean;
	businessId: BusinessInfoSetting["id"];
}

export interface ClassOutput
	extends Omit<ClassDocument, "service" | "repeat" | "serviceId" | "repeatId" | "business" | "businessId">,
		Omit<Service, "id"> {
	repeat: ClassRepeatDto;
}
