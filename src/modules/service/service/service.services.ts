import * as serviceDal from "./service.dal";
import { ServiceDocument } from "./service.interface";

export async function getServiceByTypeId(payload: number): Promise<ServiceDocument> {
	const targerService = await serviceDal.getServiceByTypeId(payload);
	targerService.queryId = payload;
	return targerService;
}

const servicesService = {
	getServiceByTypeId,
};
export default servicesService;
