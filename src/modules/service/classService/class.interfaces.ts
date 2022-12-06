import { CreateClassDto } from "./class.schema";
import { Class, Service, ClassRepeat, BusinessInfoSetting } from "@prisma/client";
import { ServiceInput } from "@src/modules/service/service/service.interface";

// TODO change basic info to serviceId
export interface ClassRepeatInput extends Omit<ClassRepeat, "id"> {}

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

export interface ClassInput
	extends Omit<Class, "id" | "createdAt" | "updatedAt" | "serviceId" | "repeatId" | "service"> {
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
}

export interface ClassServiceDto extends ClassDto {
	businessId: BusinessInfoSetting["id"];
}

export interface ClassOutput
	extends Omit<ClassDocument, "service" | "repeat" | "serviceId" | "repeatId">,
		Omit<Service, "id"> {
	repeat: ClassRepeatDto;
}
