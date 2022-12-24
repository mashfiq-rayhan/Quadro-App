import prisma from "@providers/prisma.provider";
import { ServiceDocument } from "./service.interface";
import { ErrorCodes } from "../../../errors/ErrorCodes";

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
