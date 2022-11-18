import { Types } from "mongoose";
import { CreateServiceDto } from "./service.schema";

export interface PriceInfo {
	type: string;
	price: number;
}
export interface CheckoutInfo {
	type: string;
	deposit?: number;
}

export interface ServiceInput {
	name: string;
	description?: string;
	location: string;
	staffMembers?: Types.Array<string>;
	pricingInfo: PriceInfo;
	checkoutInfo: CheckoutInfo;
}

export interface ServiceDocument extends Required<ServiceInput> {
	_id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface ServiceOutput extends Omit<ServiceDocument, "createdAt" | "updatedAt"> {}

export interface ServiceDto extends CreateServiceDto {
	description?: string;
	staffMembers?: Types.Array<string>;
	depositAmount?: number;
}
