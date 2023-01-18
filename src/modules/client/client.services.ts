import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

export class ClientServices {
	public createClient = async (data: Prisma.ClientCreateArgs) => {
		return await prisma.client.create(data);
	};

	public updateClient = async (data: Prisma.ClientUpdateArgs) => {
		return await prisma.client.update(data);
	};

	public upsertClient = async (data: Prisma.ClientUpsertArgs) => {
		return await prisma.client.upsert(data);
	};

	public getClients = async (filter: Prisma.ClientFindManyArgs) => {
		return await prisma.client.findMany(filter);
	};

	public findClient = async (filter: Prisma.ClientFindFirstArgs) => {
		return await prisma.client.findFirst(filter);
	};

	public deleteClient = async (args: Prisma.ClientDeleteArgs) => {
		return await prisma.client.delete(args);
	};
}

export default new ClientServices();
