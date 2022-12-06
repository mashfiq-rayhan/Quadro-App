import { ServiceType } from "@prisma/client";
import { ServiceInput } from "@src/modules/service/service/service.interface";

import { ClassDocument, ClassInput, ClassOutput, ClassRepeatInput, ClassServiceDto } from "./class.interfaces";

function toClassInput(payload: ClassServiceDto): ClassInput {
	const classRepeatInput: ClassRepeatInput = {
		week: payload.repeat.week,
		...classRepeatMapper(payload.repeat.days),
	};

	const serviceInformation: ServiceInput = {
		name: payload.name,
		description: payload.description ? payload.description : "",
		location: payload.location,
		price: payload.price,
		paymentType: "IN_PERSON",
		serviceType: "CLASS",
		businessId: payload.businessId,
	};

	return {
		duration: payload.duration,
		published: payload.published ? payload.published : false,
		repeat: classRepeatInput,
		service: serviceInformation,
		maxNumberOfParticipants: payload.maxNumberOfParticipants,
		startDateAndTime: payload.startDateAndTime,
		endDate: payload.endDate,
	};
}

function toClassOutput(classData: ClassDocument): ClassOutput {
	return {
		id: classData.id,
		name: classData.service.name,
		description: classData.service.description,
		price: classData.service.price,
		location: classData.service.location,
		duration: classData.duration,
		published: classData.published,
		maxNumberOfParticipants: classData.maxNumberOfParticipants,
		startDateAndTime: classData.startDateAndTime,
		endDate: classData.endDate,
		repeat: {
			week: classData.repeat.week,
			days: classRepeatToOutputMapper(classData.repeat),
		},
		paymentType: classData.service.paymentType,
		serviceType: ServiceType[classData.service.paymentType],
		businessId: classData.service.businessId,
		createdAt: classData.createdAt,
		updatedAt: classData.updatedAt,
	};
}

function classRepeatMapper(payload: Array<string>): Omit<ClassRepeatInput, "week"> {
	const days = {
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
		sunday: false,
	};

	payload.map((day) => {
		if (day in days) days[day] = true;
	});
	return days;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function classRepeatToOutputMapper(payload: ClassRepeatInput | any): Array<string> {
	const days: Array<string> = [];
	const data = payload;
	for (const key in data) {
		if (data[key] && key !== "week" && key !== "id") {
			days.push(key);
		}
	}
	return days;
}

const classMapper = {
	toClassInput,
	toClassOutput,
};
export default classMapper;
