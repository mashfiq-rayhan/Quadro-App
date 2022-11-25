import argon2 from "argon2";
import UserModel, { User } from "./user.model";
import { CreateUserDto, CreateUserGoogleDto, UserDoc } from "./user.schema";
import log from "@providers/logger.provider";
import { GenericServices } from "@src/shared/generics/generic.services";

export class UsersMongoService extends GenericServices<UserDoc> {
	public createUser = async (data: CreateUserDto): Promise<User> => {
		log.info("[service] createUser");

		return UserModel.create(data);
	};

	public createUserGoogle = async (data: CreateUserGoogleDto): Promise<User> => {
		log.info("[service] createUserGoogle");

		return UserModel.create({ ...data, verified: true });
	};

	public findUserById = async (id: string): Promise<UserDoc | undefined> => {
		log.info("[service] findUserById");

		const user = await this.findById(id, { password: 0, verificationCode: 0 });

		if (user) return user;
	};

	public findUserByEmail = async (email: string): Promise<UserDoc | undefined> => {
		log.info("[service] findUserByEmail");
		const user = await this.findOne({ email }, { password: 0, verificationCode: 0 });
		if (user) return user;
	};

	public verifyUserPassword = async (password: string, userPassword: string): Promise<boolean> => {
		log.info("[service] verifyUserPassword");

		try {
			return await argon2.verify(password, userPassword);
		} catch (error) {
			log.error(error, "Could not verify password");
			return false;
		}
	};
}

const usersMongoService: UsersMongoService = new UsersMongoService(UserModel);

export default usersMongoService;
