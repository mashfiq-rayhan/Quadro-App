import { AppointmentInput, AppointmentDocument, AppointmentID } from "./appointment.interfaces";
import AppointmentModel from "./appointment.model";
import { HydratedDocument } from "mongoose";
import { ErrorCodes } from "../../errors/ErrorCodes";

export async function create(payload: AppointmentInput): Promise<HydratedDocument<AppointmentDocument>> {
	const newAppointment = await AppointmentModel.create(payload);
	return newAppointment;
}

export async function getById(id: AppointmentID): Promise<AppointmentDocument> {
	const newAppointment = await AppointmentModel.findById(id);
	if (!newAppointment) throw Error(ErrorCodes.NotFound);
	return newAppointment;
}

export async function update(id: AppointmentID, payload: AppointmentInput): Promise<AppointmentDocument> {
	const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
		id,
		{
			$set: payload,
		},
		{ new: true },
	).exec();
	if (!updatedAppointment) throw Error(ErrorCodes.NotFound);
	return updatedAppointment;
}

export async function getAll(): Promise<Array<AppointmentDocument>> {
	const appointmentsList = await AppointmentModel.find({});
	return appointmentsList;
}

export async function deleteById(id: AppointmentID): Promise<void> {
	await AppointmentModel.findByIdAndDelete(id);
}
