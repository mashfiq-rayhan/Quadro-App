import { PaymentType, ServiceType, LocationTypes } from "@prisma/client";

import { ServiceInput } from "../service/service.interface";
import {
	AppointmentDocument,
	AppointmentInput,
	AppointmentOutput,
	AppointmentServiceDto,
} from "./appointment.interfaces";

function toAppointmentInput(payload: AppointmentServiceDto): AppointmentInput {
	const serviceInformation: ServiceInput = {
		name: payload.name,
		description: payload.description ? payload.description : "",
		location: convertLocationValue(payload.location),
		price: payload.price,
		paymentType: getPaymentAcceptType(payload.paymentAcceptType),
		serviceType: ServiceType.APPOINTMENT,
		businessId: payload.businessId,
		image: payload.images && payload.images.length !== 0 ? [...payload.images] : [],
		locationDescription: payload.locationDescription,
	};

	return {
		duration: payload.duration,
		depositAmount: payload.depositAmount ? payload.depositAmount : 0,
		published: payload.published ? payload.published : false,
		service: serviceInformation,
	};
}

function toAppointmentOutput(appointment: AppointmentDocument): AppointmentOutput {
	console.log({ images: appointment.service.images });
	return {
		id: appointment.id,
		name: appointment.service.name,
		description: appointment.service.description ? appointment.service.description : "",
		location: appointment.service.location,
		paymentAcceptType: appointment.service.paymentType,
		depositAmount: appointment.depositAmount,
		price: appointment.service.price,
		duration: appointment.duration,
		published: appointment.published,
		updatedAt: appointment.updatedAt,
		createdAt: appointment.createdAt,
		businessId: appointment.service.businessId,
		serviceType: appointment.service.serviceType,
		serviceId: appointment.service.id,
		locationDescription: appointment.service.locationDescription,
		images: appointment.service.images.map((s) => s.image.image),
	};
}

function getPaymentAcceptType(data: string): PaymentType {
	switch (data.toUpperCase()) {
		case PaymentType.IN_PERSON:
			return PaymentType.IN_PERSON;
		case PaymentType.ONLINE:
			return PaymentType.ONLINE;
		default:
			return PaymentType.IN_PERSON;
	}
}

function convertLocationValue(value: number): LocationTypes {
	switch (value) {
		case 1:
			return LocationTypes.BUSINESS;
		case 2:
			return LocationTypes.CLIENT;
		case 3:
			return LocationTypes.ONLINE;
		case 4:
			return LocationTypes.CUSTOM;
		default:
			return LocationTypes.BUSINESS;
	}
}

const appointmentMapper = {
	toAppointmentInput,
	toAppointmentOutput,
};
export default appointmentMapper;
