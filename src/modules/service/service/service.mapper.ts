import { ServiceDocument, ServiceOutput } from "./service.interface";

export function toServiceOutput(payload: ServiceDocument): ServiceOutput {
	return {
		...payload,
	};
}
