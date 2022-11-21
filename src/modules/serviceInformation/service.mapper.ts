import { ServiceInput, ServiceDocument, ServiceOutput } from "./service.interface";
import { ServiceDto } from "./service.interface";

export function toServiceInput(payload: ServiceDto): ServiceInput {
	return {
		name: payload.name,
		description: payload.description ? payload.description : "",
		location: payload.location,
		price: payload.price,
	};
}

export function toServiceOutput(payload: ServiceDocument): ServiceOutput {
	return {
		name: payload.name,
		location: payload.location,
		description: payload.description,
		price: payload.price,
		_id: payload._id,
	};
}
