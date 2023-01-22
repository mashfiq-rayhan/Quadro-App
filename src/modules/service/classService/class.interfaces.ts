import { CreateClassDto } from "./class.schema";
import { Class, Service, ClassRepeat, BusinessInfoSetting, LocationTypes, ImageOnService, Image } from "@prisma/client";
import { ServiceInput } from "@src/modules/service/service/service.interface";

// TODO change basic info to serviceId
export interface ClassRepeatInput extends Omit<ClassRepeat, "id"> {}

export interface ClassRepeatDto {
	week: number;
	days: Array<string>;
}

// FOR DB CHANGE
export interface ClassRepeatDocument extends Required<ClassRepeatInput> {
	id: number;
	classId: number;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}
interface Images extends ImageOnService {
	image: Image;
}
export interface ClassInput
	extends Omit<Class, "id" | "createdAt" | "updatedAt" | "serviceId" | "repeatId" | "service"> {
	service: ServiceInput;
	repeat: Omit<ClassRepeat, "id">;
}

export type ClassDocument = Class & {
	service: Service & {
		images: Array<Images>;
	};
	repeat: ClassRepeat;
};

export interface ClassDto extends Omit<CreateClassDto, "location"> {
	startDateAndTime: Date;
	repeat: ClassRepeatDto;
	endDate: Date;
	duration: number;
	description?: string;
	published?: boolean;
	location: number;
	images: Array<string>;
}

export interface ClassServiceDto extends ClassDto {
	businessId: BusinessInfoSetting["id"];
	images: Array<string>;
}

export interface ClassOutput extends Omit<ClassDocument, "service" | "repeat" | "repeatId">, Omit<Service, "id"> {
	repeat: ClassRepeatDto;
	images: Array<Images>;
}
