import * as serviceDal from "./service.dal";
import { ServiceID, ServiceOutput } from "./service.interface";
import * as serviceMapper from "./service.mapper";
import { ServiceDto } from "./service.interface";

export async function createService(payload: ServiceDto): Promise<ServiceOutput> {
	const service = serviceMapper.toServiceInput(payload);
	const newService = await serviceDal.create(service);
	return serviceMapper.toServiceOutput(newService);
}

export async function updateService(id: ServiceID, payload: ServiceDto): Promise<ServiceOutput> {
	const service = serviceMapper.toServiceInput(payload);
	const updatedService = await serviceDal.update(id, service);
	return serviceMapper.toServiceOutput(updatedService);
}

export async function getServiceById(payload: string): Promise<ServiceOutput> {
	const targerService = await serviceDal.getById(payload);
	return serviceMapper.toServiceOutput(targerService);
}

export async function deleteServiceById(id: ServiceID): Promise<void> {
	await serviceDal.deleteById(id);
}
