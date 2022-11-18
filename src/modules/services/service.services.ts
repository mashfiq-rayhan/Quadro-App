import * as serviceDal from "./service.dal";
import { ServiceOutput } from "./service.interface";
import * as serviceMapper from "./service.mapper";
import { ServiceDto } from "./service.interface";

export async function createService(payload: ServiceDto): Promise<ServiceOutput> {
	const service = serviceMapper.toServiceInput(payload);
	const newService = await serviceDal.createService(service);
	return serviceMapper.toServiceOutput(newService);
}

// export async function updateService( id:string ,payload: ServiceDto): Promise<ServiceOutput> {
// 	const service = serviceMapper.toServiceInput(payload);
// 	const updatedService = await serviceDal.updateService(id , service)
// }

export async function getServiceById(payload: string): Promise<ServiceOutput> {
	const targerService = await serviceDal.getServiceById(payload);
	return serviceMapper.toServiceOutput(targerService);
}
