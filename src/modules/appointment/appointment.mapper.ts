import {
	AppointmentInput,
	AppointmentDto,
	AppointmentOutput,
	AppointmentDocument,
	CheckoutInfo,
} from "./appointment.interfaces";
import { ServiceOutput } from "../serviceInformation/service.interface";

export function toAppointmentInput(payload: AppointmentDto): AppointmentInput {
	const checkoutInfo: CheckoutInfo = {
		type: payload.paymentAcceptType,
		deposit: payload.depositAmount ? payload.depositAmount : 0,
	};
	return {
		serviceId: payload.serviceId,
		duration: payload.duration,
		checkoutInfo: checkoutInfo,
		published: payload.published ? payload.published : false,
	};
}

export function toAppointmentOutput(appointment: AppointmentDocument, service: ServiceOutput): AppointmentOutput {
	return {
		_id: appointment._id,
		name: service.name,
		description: service.description ? service.description : "",
		location: service.location,
		paymentAcceptType: appointment.checkoutInfo.type,
		depositAmount: appointment.checkoutInfo.deposit ? appointment.checkoutInfo.deposit : 0,
		price: service.price,
		duration: appointment.duration,
		published: appointment.published,
		updatedAt: appointment.updatedAt,
		createdAt: appointment.createdAt,
	};
}
