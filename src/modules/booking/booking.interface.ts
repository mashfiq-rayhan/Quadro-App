import { Types } from "mongoose";

export interface BookingInput {
	userId: Types.ObjectId;
	bookingType: "string";
	bookingRef: Types.ObjectId;
	bookingTime: Date;
	orderId?: Types.ObjectId;
	note?: string;
}

export interface BookingDocument extends Required<BookingInput> {
	_id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface BookingOutput extends BookingDocument {}
