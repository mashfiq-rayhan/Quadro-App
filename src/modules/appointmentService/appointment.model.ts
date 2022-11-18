import { Schema, model, Model } from "mongoose";
import { ServiceOutput } from "../services/service.interface";
import { AppointmentDocument } from "./appointment.interfaces";

const AppointmentSchema = new Schema<AppointmentDocument, Model<AppointmentDocument>>(
	{
		basicInfo: { type: Schema.Types.ObjectId, ref: "Service" },
		duration: { type: Number, required: true },
		timeBetweenSession: { type: Number, required: true },
		published: { type: Boolean, default: false },
		active: { type: Boolean, default: true },
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
