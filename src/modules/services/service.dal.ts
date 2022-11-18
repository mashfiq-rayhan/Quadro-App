import { ServiceInput, ServiceOutput, ServiceDocument } from "./service.interface";
import Service from "./service.model";

export async function createService(payload: ServiceInput): Promise<ServiceDocument> {
	const newService: ServiceDocument = await Service.create(payload);
	return newService;
}

export async function getServiceById(payload: string): Promise<ServiceDocument> {
	const newService = await Service.findById(payload);
	if (!newService) throw Error("Service Not Found");
	return newService;
}

export async function updateService(id: string, payload: ServiceInput): Promise<ServiceDocument> {
	const updatedService = await Service.findByIdAndUpdate(
		id,
		{
			$set: payload,
		},
		{ new: true },
	).exec();
	if (!updatedService) throw Error("Update Failed");
	return updatedService;
}
