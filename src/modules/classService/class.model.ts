import { Schema, model, Model } from "mongoose";
import { ClassDocument, ClassRepeatInput } from "./class.interfaces";

// TODO: Convert into a Table after DB Change
const ClassRepeatSchema = new Schema<ClassRepeatInput, Model<ClassRepeatInput>>(
	{
		week: { type: Number },
		monday: { type: Boolean, default: false },
		tuesday: { type: Boolean, default: false },
		wednesday: { type: Boolean, default: false },
		thursday: { type: Boolean, default: false },
		friday: { type: Boolean, default: false },
		saturday: { type: Boolean, default: false },
		sunday: { type: Boolean, default: false },
	},
	{
		timestamps: false,
		_id: false,
	},
);

const ClassSchema = new Schema<ClassDocument, Model<ClassDocument>>(
	{
		serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
		classRepeatId: { type: ClassRepeatSchema },
		maxNumberOfParticipants: { type: Number },
		duration: { type: Number, required: true },
		startDateAndTime: { type: Schema.Types.Date },
		endDate: { type: Schema.Types.Date },
		published: { type: Boolean, default: false },
		active: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	},
);

const ClassModel = model<ClassDocument>("Class", ClassSchema);

export default ClassModel;
