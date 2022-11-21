import { Schema, model, Model } from "mongoose";
import { BookingDocument } from "./booking.interface";

const bookingSchema = new Schema<BookingDocument, Model<BookingDocument>>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
		orderId: { type: Schema.Types.ObjectId, ref: "Order" },
		bookingType: { type: String, required: true },
		bookingRef: { type: Schema.Types.ObjectId, required: true },
		bookingTime: { type: Date, default: new Date() },
		note: String,
	},
	{
		timestamps: true,
	},
);

const Booking = model<BookingDocument>("Booking", bookingSchema);

export default Booking;
