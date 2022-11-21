import { Schema, model, Model } from "mongoose";
import { ServiceOutput } from "../serviceInformation/service.interface";
import { AppointmentDocument, CheckoutInfo } from "./appointment.interfaces";

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

const AppointmentSchema = new Schema<AppointmentDocument, Model<AppointmentDocument>>(
	{
		serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
		duration: { type: Number, required: true },
		published: { type: Boolean, default: false },
		active: { type: Boolean, default: true },
		checkoutInfo: { type: checkoutInfo },
	},
	{
		timestamps: true,
	},
);

export interface AppointmentPopulatedDocument extends AppointmentDocument {
	serviceInfo: ServiceOutput;
}

export interface AppointmentExtendedModel extends Model<AppointmentDocument> {
	findMyService(id: string): Promise<AppointmentPopulatedDocument>;
}

AppointmentSchema.statics.findWithService = async function (this: Model<AppointmentDocument>, id: string) {
	return this.findById(id).populate("basicInfo").exec();
};

const AppointmentModel = model<AppointmentDocument, AppointmentExtendedModel>("Appointment", AppointmentSchema);

export default AppointmentModel;
