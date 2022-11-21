import { ErrorCodes } from "@src/errors/ErrorCodes";
import { ServiceInput, ServiceOutput, ServiceDocument, ServiceID } from "./service.interface";
import Service from "./service.model";

export async function create(payload: ServiceInput): Promise<ServiceDocument> {
	const newService: ServiceDocument = await Service.create(payload);
	return newService;
}

export async function getById(payload: string): Promise<ServiceDocument> {
	const newService = await Service.findById(payload);
	if (!newService) throw Error(ErrorCodes.NotFound);
	return newService;
}

export async function update(id: ServiceID, payload: ServiceInput): Promise<ServiceDocument> {
	const updatedService = await Service.findByIdAndUpdate(
		id,
		{
			$set: payload,
		},
		{ new: true },
	).exec();
	if (!updatedService) throw Error(ErrorCodes.NotFound);
	return updatedService;
}

export async function deleteById(id: ServiceID): Promise<void> {
	await Service.findByIdAndDelete(id);
}
