import { Schema, model } from "mongoose";
import { CheckoutInfo, PriceInfo, ServiceDocument } from "./service.interface";

const pricingInfo = new Schema<PriceInfo>(
	{
		type: {
			type: String,
		},
		price: { type: Number, default: 0 },
	},
	{
		timestamps: false,
		_id: false,
	},
);
const checkoutInfo = new Schema<CheckoutInfo>(
	{
		type: {
			type: String,
		},
		deposit: { type: Number, default: 0 },
	},
	{
		timestamps: false,
		_id: false,
	},
);

const serviceSchema = new Schema<ServiceDocument>(
	{
		name: { type: String, required: true },
		description: { type: String },
		location: { type: String, required: true },
		staffMembers: { type: [String] },
		pricingInfo: pricingInfo,
		checkoutInfo: checkoutInfo,
	},
	{
		timestamps: true,
	},
);

const ServiceModel = model<ServiceDocument>("Service", serviceSchema);

export default ServiceModel;
