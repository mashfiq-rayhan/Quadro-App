import { DocumentType, getModelForClass, index, modelOptions, plugin, pre, prop, Severity } from "@typegoose/typegoose";
import { FlattenMaps } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";
import { omit } from "lodash";
import { Exclude } from "class-transformer";
import usersMongoService from "./user.services.mongo";

@modelOptions({
	schemaOptions: {
		collection: "users",
		timestamps: true,
		versionKey: false,
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
// Hash password if it is modified
@pre<User>("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	const hashed = await argon2.hash(this.password);
	this.password = hashed;

	return;
})
@index({ email: 1 }, { unique: true })
@plugin(passportLocalMongoose)
export class User {
	@prop({ required: true, unique: true, lowercase: true })
	public email: string;

	@prop({ required: true })
	public name: string;

	@Exclude()
	@prop()
	public password: string;

	@Exclude()
	@prop({ required: true, default: () => uuid() })
	public verificationCode: string;

	@Exclude()
	@prop()
	public passwordResetCode: string | undefined;

	@prop({ default: false })
	public verified: boolean;

	@prop()
	public method: string;

	@prop()
	public googleId: string;

	@prop()
	public profilePicture: string;

	public async validatePassword(this: DocumentType<User>, userPassword: string): Promise<boolean> {
		return await usersMongoService.verifyUserPassword(this.password, userPassword);
	}

	public toJSON(this: DocumentType<User>): FlattenMaps<Partial<User>> {
		const user = this.toObject();
		return omit(user, "password", "verificationCode");
	}
}

const UserModel = getModelForClass(User);

export default UserModel;
