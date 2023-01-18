import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

export class PlanServices {
	public createPlan = async (data: Prisma.PlanCreateArgs) => {
		return await prisma.plan.create(data);
	};

	public updatePlan = async (data: Prisma.PlanUpdateArgs) => {
		return await prisma.plan.update(data);
	};

	public upsertPlan = async (data: Prisma.PlanUpsertArgs) => {
		return await prisma.plan.upsert(data);
	};

	public getPlans = async (filter: Prisma.PlanFindManyArgs) => {
		return await prisma.plan.findMany(filter);
	};

	public findPlan = async (filter: Prisma.PlanFindFirstArgs) => {
		return await prisma.plan.findFirst(filter);
	};

	public deletePlan = async (args: Prisma.PlanDeleteArgs) => {
		return await prisma.plan.delete(args);
	};
}

export default new PlanServices();
