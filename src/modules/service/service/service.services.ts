import * as serviceDal from "./service.dal";
import { ServiceDocument } from "./service.interface";

export async function getServiceByTypeId(payload: number): Promise<ServiceDocument> {
	const targerService = await serviceDal.getServiceByTypeId(payload);
	targerService.queryId = payload;
	return targerService;
}

export async function getServiceByType(payload: number, type: string): Promise<ServiceDocument> {
	const targerService = await serviceDal.getServiceByType(payload, type);
	targerService.queryId = payload;
	return targerService;
}

const servicesService = {
	getServiceByTypeId,
	getServiceByType,
};
export default servicesService;
