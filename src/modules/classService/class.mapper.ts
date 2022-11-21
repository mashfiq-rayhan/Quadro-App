import { ClassInput, ClassOutput, ClassDocument, ClassRepeatInput } from "./class.interfaces";
import { ServiceOutput } from "../serviceInformation/service.interface";
import { ClassDto } from "./class.interfaces";

export function toClassInput(payload: ClassDto): ClassInput {
	const classRepeatInput: ClassRepeatInput = {
		week: payload.repeat.week,
		...classRepeatMapper(payload.repeat.days),
	};
	return {
		serviceId: payload.serviceId,
		duration: payload.duration,
		published: payload.published ? payload.published : false,
		classRepeatId: classRepeatInput,
		maxNumberOfParticipants: payload.maxNumberOfParticipants,
		startDateAndTime: payload.startDateAndTime,
		endDate: payload.endDate,
	};
}

export function toClassOutput(classData: ClassDocument, service: ServiceOutput): ClassOutput {
	return {
		_id: classData._id,
		name: service.name,
		description: service.description ? service.description : "",
		price: service.price,
		location: service.location,
		duration: classData.duration,
		published: classData.published,
		maxNumberOfParticipants: classData.maxNumberOfParticipants,
		startDateAndTime: classData.startDateAndTime,
		endDate: classData.endDate,
		repeat: {
			week: classData.classRepeatId.week,
			days: classRepeatToOutputMapper(classData.classRepeatId),
		},
		updatedAt: classData.updatedAt,
		createdAt: classData.createdAt,
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

//TODO: Should be fixed with DB update
// eslint-disable-next-line @typescript-eslint/no-explicit-any

function classRepeatToOutputMapper(payload: ClassRepeatInput | any): Array<string> {
	const days: Array<string> = [];
	const data = payload.toObject();
	for (const key in data) {
		if (data[key] && key !== "week") {
			days.push(key);
		}
	}
	return days;
}
