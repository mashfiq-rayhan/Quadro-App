import * as servicesService from "../services/service.services";
import log from "@providers/logger.provider";
import { AppointmentOutput, AppointmentDto, AppointmentDocument } from "./appointment.interfaces";
import { ServiceOutput } from "../services/service.interface";
import * as appointmentMapper from "./appointment.mapper";
import * as appointmentDal from "./appointment.dal";

export async function createAppointments(payload: AppointmentDto): Promise<AppointmentOutput> {
	try {
		const newService: ServiceOutput = await servicesService.createService(payload);
		const appointmentDto: AppointmentDto = { ...payload, serviceId: newService._id };
		const newAppointment: AppointmentDocument = await appointmentDal.createAppointment(
			appointmentMapper.toAppointmentInput(appointmentDto),
		);
		if (!newAppointment) throw Error("Failed Creating Appointment"); // TODO Throw a fallback to service
		return appointmentMapper.toAppointmentOutput(newAppointment, newService);
	} catch (error) {
		log.error(" Failed Creating Appointment Service ", error);
		throw error;
	}
}

//TODO : AppointmentDocument => AppointmentOutoput
export async function updateAppointment(id: string, payload: AppointmentDto): Promise<AppointmentDocument> {
	const updatedAppointment = await appointmentDal.updateAppointment(
		id,
		appointmentMapper.toAppointmentInput(payload),
	);
	return updatedAppointment;
}

export async function getAppointmentById(payload: string): Promise<AppointmentOutput> {
	try {
		const targerAppointment = await appointmentDal.getAppointmentById(payload);
		return await populateWithServiceInformation(targerAppointment);
	} catch (error) {
		log.error(`Getting Appointment Failed Error => ${error} `);
		throw error;
	}
}

export async function getAllAppointments(): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAllAppointments();
	const populatedAppointmentsList: Array<AppointmentOutput> = [];

	for await (const iterator of appointmentsList) {
		const populatedAppointment = await populateWithServiceInformation(iterator);
		populatedAppointmentsList.push(populatedAppointment);
	}

	return populatedAppointmentsList;
}

async function populateWithServiceInformation(payload: AppointmentDocument): Promise<AppointmentOutput> {
	const targerService = await servicesService.getServiceById(String(payload.basicInfo));
	return appointmentMapper.toAppointmentOutput(payload, targerService);
}
