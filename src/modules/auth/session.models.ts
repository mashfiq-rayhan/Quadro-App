import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { User } from "../users/user.model";

@modelOptions({
	schemaOptions: {
		collection: "sessions",
		timestamps: true,
		versionKey: false,
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
export class Session {
	@prop({ ref: () => User })
	public user: Ref<User>;

	@prop({ default: true })
	public valid: boolean;
}

const SessionModels = getModelForClass(Session);

export default SessionModels;
