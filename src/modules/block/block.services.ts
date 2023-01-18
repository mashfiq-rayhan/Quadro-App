import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

export class BlockServices {
	public createBlock = async (data: Prisma.BlockCreateArgs) => {
		return await prisma.block.create(data);
	};

	public updateBlock = async (data: Prisma.BlockUpdateArgs) => {
		return await prisma.block.update(data);
	};

	public upsertBlock = async (data: Prisma.BlockUpsertArgs) => {
		return await prisma.block.upsert(data);
	};

	public getBlocks = async (filter: Prisma.BlockFindManyArgs) => {
		return await prisma.block.findMany(filter);
	};

	public findBlock = async (filter: Prisma.BlockFindFirstArgs) => {
		return await prisma.block.findFirst(filter);
	};

	public deleteBlock = async (args: Prisma.BlockDeleteArgs) => {
		return await prisma.block.delete(args);
	};
}

export default new BlockServices();
