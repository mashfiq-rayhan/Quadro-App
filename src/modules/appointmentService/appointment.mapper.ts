import {
	BlockedTime,
	Duration,
	AppointmentInput,
	AppointmentOutput,
	AppointmentDocument,
} from "./appointment.interfaces";
import { ServiceOutput } from "../services/service.interface";
import { AppointmentDto } from "./appointment.interfaces";

export function toAppointmentInput(payload: AppointmentDto): AppointmentInput {
	return {
		basicInfo: payload.serviceId,
		duration: payload.duration,
		timeBetweenSession: payload.timeBetweenSession,
		published: payload.published ? payload.published : false,
	};
}

export function toAppointmentOutput(appointment: AppointmentDocument, service: ServiceOutput): AppointmentOutput {
	return {
		_id: appointment._id,
		name: service.name,
		description: service.description ? service.description : "",
		location: service.location,
		pricingInfo: service.pricingInfo,
		checkoutInfo: service.checkoutInfo,
		staffMembers: service.staffMembers,
		duration: appointment.duration,
		timeBetweenSession: appointment.timeBetweenSession,
		published: appointment.published,
		updatedAt: appointment.updatedAt,
		createdAt: appointment.createdAt,
	};
}
