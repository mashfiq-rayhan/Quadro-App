import { AppointmentInput, AppointmentDocument } from "./appointment.interfaces";
import AppointmentModel from "./appointment.model";
import { HydratedDocument } from "mongoose";

export async function createAppointment(payload: AppointmentInput): Promise<HydratedDocument<AppointmentDocument>> {
	const newAppointment = await AppointmentModel.create(payload);
	return newAppointment;
}

export async function getAppointmentById(payload: string): Promise<AppointmentDocument> {
	const newAppointment = await AppointmentModel.findById(payload);
	if (!newAppointment) throw Error("Appointment Not found");
	return newAppointment;
}

export async function updateAppointment(id: string, payload: AppointmentInput): Promise<AppointmentDocument> {
	const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
		id,
		{
			$set: payload,
		},
		{ new: true },
	).exec();
	if (!updatedAppointment) throw Error("Update Failed");
	return updatedAppointment;
}

export async function getAllAppointments(): Promise<Array<AppointmentDocument>> {
	const appointmentsList = await AppointmentModel.find({});
	return appointmentsList;
}
