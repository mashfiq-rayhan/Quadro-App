import { AppointmentInput, AppointmentDocument } from "./appointment.interfaces";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import prisma from "@providers/prisma.provider";
import { Prisma } from "@prisma/client";

async function create(payload: AppointmentInput): Promise<AppointmentDocument> {
	const newAppointment = await prisma.appointment.create({
		data: {
			duration: payload.duration,
			depositAmount: payload.depositAmount,
			published: payload.published,
			service: {
				create: {
					name: payload.service.name,
					description: payload.service.description,
					location: payload.service.location,
					price: payload.service.price,
					paymentType: payload.service.paymentType,
					serviceType: payload.service.serviceType,
					locationDescription: payload.service.locationDescription,
					// image: body.services?.length
					// 	? {
					// 			create: body.services.map((s) => ({
					// 				service: { connect: { id: s } },
					// 				assignedBy: { connect: { id: userId } },
					// 			})),
					// 	  }
					// 	: undefined,
					images:
						payload.service?.image.length !== 0
							? {
									create: payload.service?.image.map((imageUrl) => ({
										image: {
											create: {
												image: imageUrl,
											},
										},
									})),
							  }
							: undefined,
					business: { connect: { id: payload.service.businessId } },
				},
			},
		},
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	return newAppointment;
}

async function getById(id: number): Promise<AppointmentDocument> {
	const targetAppointment = await prisma.appointment.findUnique({
		where: {
			id: id,
		},
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	if (!targetAppointment) throw Error(ErrorCodes.NotFound + ` No Appointment Found with Id : ${id}`);
	return targetAppointment;
}

async function update(id: number, payload: AppointmentInput): Promise<AppointmentDocument> {
	const targetAppointment = await getById(id);

	if (!targetAppointment) throw Error(ErrorCodes.NotFound);

	const updatedAppointment = await prisma.appointment.update({
		where: {
			id: id,
		},
		data: {
			duration: payload.duration,
			depositAmount: payload.depositAmount,
			published: payload.published,
			service: {
				update: {
					name: payload.service.name,
					description: payload.service.description,
					location: payload.service.location,
					price: payload.service.price,
					paymentType: payload.service.paymentType,
					serviceType: payload.service.serviceType,
				},
			},
		},
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});

	return updatedAppointment;
}

async function getAll(): Promise<Array<AppointmentDocument>> {
	const appointmentsList = await prisma.appointment.findMany({
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	return appointmentsList;
}

async function getAllbyFilter(filter: Prisma.AppointmentFindManyArgs): Promise<Array<AppointmentDocument>> {
	const appointmentsList = await prisma.appointment.findMany({
		...filter,
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	return appointmentsList;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getbyFilter(filter: Prisma.AppointmentFindFirstArgsBase): Promise<AppointmentDocument | any> {
	const targetAppointment = await prisma.appointment.findFirst({
		...filter,
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	return targetAppointment;
}

async function deleteById(id: number): Promise<void> {
	const targetAppointment = await getById(id);
	if (!targetAppointment) throw Error(ErrorCodes.NotFound);

	await prisma.appointment.delete({
		where: {
			id: id,
		},
	});
	await prisma.service.delete({
		where: {
			id: targetAppointment.service.id,
		},
	});
}

async function getAppointment(filter: Prisma.AppointmentFindFirstArgs): Promise<AppointmentDocument | boolean> {
	const targetAppointment = await prisma.appointment.findFirst({
		...filter,
		include: {
			service: {
				include: {
					images: {
						include: {
							image: true,
						},
					},
				},
			},
		},
	});
	if (!targetAppointment) return false;
	return targetAppointment;
}

const appointmentDal = {
	create,
	getById,
	update,
	getAll,
	getAllbyFilter,
	getbyFilter,
	deleteById,
	getAppointment,
};
export default appointmentDal;
