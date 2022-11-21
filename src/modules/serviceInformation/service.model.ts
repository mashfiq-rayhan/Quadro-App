import { Schema, model } from "mongoose";
import { ServiceDocument } from "./service.interface";

// const pricingInfo = new Schema<PriceInfo>(
// 	{
// 		type: {
// 			type: String,
// 		},
// 		price: { type: Number, default: 0 },
// 	},
// 	{
// 		timestamps: false,
// 		_id: false,
// 	},
// );
// const checkoutInfo = new Schema<CheckoutInfo>(
// 	{
// 		type: {
// 			type: String,
// 		},
// 		deposit: { type: Number, default: 0 },
// 	},
// 	{
// 		timestamps: false,
// 		_id: false,
// 	},
// );

const serviceSchema = new Schema<ServiceDocument>(
	{
		name: { type: String, required: true },
		description: { type: String },
		location: { type: String, required: true, default: "To be determined" },
		price: { type: Number },
	},
	{
		timestamps: true,
	},
);

const ServiceModel = model<ServiceDocument>("Service", serviceSchema);

export default ServiceModel;
