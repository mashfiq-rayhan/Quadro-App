import log from "@providers/logger.provider";
import { AppointmentOutput, AppointmentDto, AppointmentDocument } from "./appointment.interfaces";
import * as appointmentMapper from "./appointment.mapper";
import * as appointmentDal from "./appointment.dal";

export async function createAppointment(payload: AppointmentDto): Promise<AppointmentOutput> {
	const newAppointment: AppointmentDocument = await appointmentDal.create(
		appointmentMapper.toAppointmentInput(payload),
	);

	if (!newAppointment) throw Error("Failed Creating Appointment");
	return appointmentMapper.toAppointmentOutput(newAppointment);
}

export async function updateAppointment(id: string, payload: AppointmentDto): Promise<AppointmentOutput> {
	log.info("Updating Appointment");
	const updatedAppointment = await appointmentDal.update(id, appointmentMapper.toAppointmentInput(payload));
	return appointmentMapper.toAppointmentOutput(updatedAppointment);
}

export async function getAppointmentById(id: string): Promise<AppointmentOutput> {
	try {
		const targerAppointment = await appointmentDal.getById(id);
		return appointmentMapper.toAppointmentOutput(targerAppointment);
	} catch (error) {
		log.error(`Getting Appointment Failed Error => ${error} `);
		throw error;
	}
}

export async function getAllAppointments(): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAll();
	return mapList(appointmentsList);
}

export async function getAllAppointmentsByUser(userId: number, businessId: number): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAllbyFilter({
		where: {
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
	});
	return mapList(appointmentsList);
}

export async function getAllAppointmentsByBusiness(businessId: number): Promise<Array<AppointmentOutput>> {
	const appointmentsList: Array<AppointmentDocument> = await appointmentDal.getAllbyFilter({
		where: {
			AND: [{ businessId: businessId }, { published: true }],
		},
	});
	return mapList(appointmentsList);
}

export async function deleteAppointment(id: string): Promise<void> {
	await appointmentDal.deleteById(id);
}

function mapList(appointmentsList: Array<AppointmentDocument>): Array<AppointmentOutput> {
	const mappedAppointmentsList: Array<AppointmentOutput> = [];
	for (const iterator of appointmentsList) {
		mappedAppointmentsList.push(appointmentMapper.toAppointmentOutput(iterator));
	}
	return mappedAppointmentsList;
}
