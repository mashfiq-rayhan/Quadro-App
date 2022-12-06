import { Prisma } from "@prisma/client";
import log from "@providers/logger.provider";

import appointmentDal from "./appointment.dal";
import { AppointmentDocument, AppointmentOutput, AppointmentServiceDto } from "./appointment.interfaces";
import appointmentMapper from "./appointment.mapper";

async function createAppointment(payload: AppointmentServiceDto): Promise<AppointmentOutput> {
	const newAppointment: AppointmentDocument = await appointmentDal.create(
		appointmentMapper.toAppointmentInput(payload),
	);

	if (!newAppointment) throw Error("Failed Creating Appointment");
	return appointmentMapper.toAppointmentOutput(newAppointment);
}

async function updateAppointment(id: string, payload: AppointmentServiceDto): Promise<AppointmentOutput> {
	log.info("Updating Appointment");
	const updatedAppointment = await appointmentDal.update(id, appointmentMapper.toAppointmentInput(payload));
	return appointmentMapper.toAppointmentOutput(updatedAppointment);
}

async function getAppointmentById(id: string): Promise<AppointmentOutput> {
	try {
		const targerAppointment = await appointmentDal.getById(id);
		return appointmentMapper.toAppointmentOutput(targerAppointment);
	} catch (error) {
		log.error(`Getting Appointment Failed Error => ${error} `);
		throw error;
	}
}

async function getAppointmentServiceId(id: string): Promise<string> {
	const targerAppointment = await appointmentDal.getById(id);
	return targerAppointment.serviceId;
}

async function getAllAppointments(): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAll();
	return mapList(appointmentsList);
}

async function getAllAppointmentsByUser(userId: number, businessId: number): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAllbyFilter({
		where: {
			service: {
				business: {
					AND: [
						{
							user: {
								id: userId,
							},
						},
						{
							user: {
								BusinessInfoSetting: {
									id: businessId,
								},
							},
						},
					],
				},
			},
		},
	});
	return mapList(appointmentsList);
}

async function getAllAppointmentsByBusiness(businessId: number): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAllbyFilter({
		where: {
			AND: [{ service: { businessId: businessId } }, { published: true }],
		},
	});
	return mapList(appointmentsList);
}

async function getAppointmentByFilter(
	filter: Prisma.AppointmentFindFirstArgsBase,
): Promise<AppointmentOutput | boolean> {
	const target = await appointmentDal.getbyFilter(filter);
	if (!target) return false;
	return appointmentMapper.toAppointmentOutput(target);
}

async function deleteAppointment(id: string): Promise<void> {
	await appointmentDal.deleteById(id);
}

function mapList(appointmentsList: Array<AppointmentDocument>): Array<AppointmentOutput> {
	const mappedAppointmentsList: Array<AppointmentOutput> = [];
	for (const iterator of appointmentsList) {
		mappedAppointmentsList.push(appointmentMapper.toAppointmentOutput(iterator));
	}
	return mappedAppointmentsList;
}

const appointmentSetvice = {
	createAppointment,
	updateAppointment,
	getAppointmentById,
	getAllAppointments,
	getAllAppointmentsByUser,
	getAllAppointmentsByBusiness,
	getAppointmentByFilter,
	deleteAppointment,
	getAppointmentServiceId,
};

export default appointmentSetvice;
