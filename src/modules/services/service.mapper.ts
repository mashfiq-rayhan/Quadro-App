import { ServiceInput, PriceInfo, CheckoutInfo, ServiceDocument, ServiceOutput } from "./service.interface";
import { ServiceDto } from "./service.interface";

export function toServiceInput(payload: ServiceDto): ServiceInput {
	const priceInfo: PriceInfo = {
		type: payload.priceType ? payload.priceType : "fixed-price",
		price: payload.price ? payload.price : 0,
	};

	const checkoutInfo: CheckoutInfo = {
		type: payload.paymentAcceptType,
		deposit: payload.depositAmount ? payload.depositAmount : 0,
	};

	return {
		name: payload.name,
		description: payload.description ? payload.description : "",
		location: payload.location,
		staffMembers: payload.staffMembers,
		pricingInfo: priceInfo,
		checkoutInfo: checkoutInfo,
	};
}

export function toServiceOutput(payload: ServiceDocument): ServiceOutput {
	return {
		name: payload.name,
		location: payload.location,
		description: payload.description,
		staffMembers: payload.staffMembers,
		pricingInfo: payload.pricingInfo,
		checkoutInfo: payload.checkoutInfo,
		_id: payload._id,
	};
}
