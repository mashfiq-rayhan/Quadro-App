import { ServiceInput } from "@src/common/types/serviceInformation.types";
import { AppointmentInput, AppointmentDto, AppointmentOutput, AppointmentDocument } from "./appointment.interfaces";

export function toAppointmentInput(payload: AppointmentDto): AppointmentInput {
	const serviceInformation: ServiceInput = {
		name: payload.name,
		description: payload.description,
		location: payload.location,
		price: payload.price,
	};

	return {
		duration: payload.duration,
		paymentAcceptType: payload.paymentAcceptType,
		depositAmount: payload.depositAmount,
		published: payload.published ? payload.published : false,
		service: serviceInformation,
		businessId: payload.businessId,
	};
}

export function toAppointmentOutput(appointment: AppointmentDocument): AppointmentOutput {
	return {
		id: appointment.id,
		name: appointment.service.name,
		description: appointment.service.description ? appointment.service.description : "",
		location: appointment.service.location,
		paymentAcceptType: appointment.paymentAcceptType,
		depositAmount: appointment.depositAmount,
		price: appointment.service.price,
		duration: appointment.duration,
		published: appointment.published,
		updatedAt: appointment.updatedAt,
		createdAt: appointment.createdAt,
	};
}
