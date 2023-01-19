import prisma from "@providers/prisma.provider";
import { ServiceDocument } from "./service.interface";
import { ErrorCodes } from "../../../errors/ErrorCodes";
import { ServiceType } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServiceByTypeId(id: number): Promise<ServiceDocument | any> {
	const targerService = await prisma.service.findFirst({
		where: {
			OR: [
				{
					appointment: {
						id: id,
					},
				},
				{
					class: {
						id: id,
					},
				},
			],
		},
		include: {
			appointment: true,
			class: true,
		},
	});
	if (!targerService) throw Error(ErrorCodes.NotFound + " : No Service Found with Id :" + id);
	return targerService;
}

export async function getServiceByType(id: number, type: string): Promise<ServiceDocument | any> {
	let targetService: ServiceDocument | any;
	if (type.toLocaleUpperCase() === ServiceType.APPOINTMENT) {
		targetService = await prisma.service.findFirst({
			where: {
				appointment: {
					id: id,
				},
			},
			include: {
				appointment: true,
			},
		});
	}
	if (type.toLocaleUpperCase() === ServiceType.CLASS) {
		targetService = await prisma.service.findFirst({
			where: {
				class: {
					id: id,
				},
			},
			include: {
				class: true,
			},
		});
	}
	if (!targetService) throw Error(ErrorCodes.NotFound + " : No Service Found with Id :" + id);
	return targetService;
}
