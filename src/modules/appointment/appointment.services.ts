import * as servicesService from "../serviceInformation/service.services";
import log from "@providers/logger.provider";
import { AppointmentOutput, AppointmentDto, AppointmentDocument, AppointmentID } from "./appointment.interfaces";
import { ServiceOutput } from "../serviceInformation/service.interface";
import * as appointmentMapper from "./appointment.mapper";
import * as appointmentDal from "./appointment.dal";

export async function createAppointment(payload: AppointmentDto): Promise<AppointmentOutput> {
	const newService: ServiceOutput = await servicesService.createService(payload);
	const appointmentDto: AppointmentDto = { ...payload, serviceId: newService._id };
	const newAppointment: AppointmentDocument = await appointmentDal.create(
		appointmentMapper.toAppointmentInput(appointmentDto),
	);
	if (!newAppointment) throw Error("Failed Creating Appointment"); // TODO Throw a fallback to service
	return appointmentMapper.toAppointmentOutput(newAppointment, newService);
}

export async function updateAppointment(id: string, payload: AppointmentDto): Promise<AppointmentOutput> {
	const updatedAppointment = await appointmentDal.update(id, appointmentMapper.toAppointmentInput(payload));
	log.info("Appointment Updated ---- Updating Service Info");
	const updatedService = await servicesService.updateService(updatedAppointment.serviceId, payload);

	return appointmentMapper.toAppointmentOutput(updatedAppointment, updatedService);
}

export async function getAppointmentById(id: AppointmentID): Promise<AppointmentOutput> {
	try {
		const targerAppointment = await appointmentDal.getById(id);
		return await populateWithServiceInformation(targerAppointment);
	} catch (error) {
		log.error(`Getting Appointment Failed Error => ${error} `);
		throw error;
	}
}

export async function getAllAppointments(): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAll();
	const populatedAppointmentsList: Array<AppointmentOutput> = [];

	for await (const iterator of appointmentsList) {
		const populatedAppointment = await populateWithServiceInformation(iterator);
		populatedAppointmentsList.push(populatedAppointment);
	}

	return populatedAppointmentsList;
}

export async function deleteAppointment(id: AppointmentID): Promise<void> {
	const targetAppointment = await appointmentDal.getById(id);
	await appointmentDal.deleteById(targetAppointment._id);
	await servicesService.deleteServiceById(targetAppointment.serviceId);
}

async function populateWithServiceInformation(payload: AppointmentDocument): Promise<AppointmentOutput> {
	const targerService = await servicesService.getServiceById(String(payload.serviceId));
	return appointmentMapper.toAppointmentOutput(payload, targerService);
}
