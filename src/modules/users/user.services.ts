import { CreateUserDto } from "@modules/users/user.schema";
import log from "@providers/logger.provider";
import prisma from "@providers/prisma.provider";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";
import { Prisma } from "@prisma/client";

export class UserServices {
	public createUser = async (data: CreateUserDto) => {
		log.info("[service] createUser");

		const { passwordConfirmation, ...userInput } = data;
		userInput.password = await argon2.hash(userInput.password);

		return await prisma.user.create({ data: { ...userInput, verified: true, verificationCode: uuid() } });
	};

	public createUserGoogle = async (data: Prisma.UserCreateInput) => {
		log.info("[service] createUserGoogle");

		return await prisma.user.create({ data: { ...data, verified: true } });
	};

	public updateUserGoogle = async (data: Prisma.UserUpdateInput) => {
		log.info("[service] updateUserGoogle");

		return await prisma.user.update({
			where: { email: data.email as string },
			data: { ...data, verified: true },
		});
	};

	public findOne = async (filter: Prisma.UserFindFirstArgs) => {
		log.info("[service] findOne");

		const user = await prisma.user.findFirst(filter);
		if (user) return user;
	};

	public findUserById = async (id: number) => {
		log.info("[service] findUserById");

		const user = await prisma.user.findFirst({ where: { id } });
		if (user) return user;
	};

	public findUserByEmail = async (email: string) => {
		log.info("[service] findUserByEmail");
		const user = await prisma.user.findFirst({ where: { email } });
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

const userServices: UserServices = new UserServices();
export default userServices;
