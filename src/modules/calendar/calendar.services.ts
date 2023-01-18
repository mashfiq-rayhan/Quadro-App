import { Prisma } from "@prisma/client";
import prisma from "@providers/prisma.provider";

export class CalendarServices {
	public createCalendar = async (data: Prisma.CalendarCreateArgs) => {
		return await prisma.calendar.create(data);
	};

	public updateCalendar = async (data: Prisma.CalendarUpdateArgs) => {
		return await prisma.calendar.update(data);
	};

	public updateClientCalendar = async (data: Prisma.ClientsOnCalendarsUpdateArgs) => {
		return await prisma.clientsOnCalendars.update(data);
	};

	public upsertCalendar = async (data: Prisma.CalendarUpsertArgs) => {
		return await prisma.calendar.upsert(data);
	};

	public getCalendars = async (filter: Prisma.CalendarFindManyArgs) => {
		return await prisma.calendar.findMany(filter);
	};

	public findCalendar = async (filter: Prisma.CalendarFindFirstArgs) => {
		return await prisma.calendar.findFirst(filter);
	};

	public deleteCalendar = async (args: Prisma.CalendarDeleteArgs) => {
		return await prisma.calendar.delete(args);
	};

	public deleteMany = async (args: Prisma.CalendarDeleteManyArgs) => {
		return await prisma.calendar.deleteMany(args);
	};

	public deleteParticipants = async (args: Prisma.ClientsOnCalendarsDeleteManyArgs) => {
		return prisma.clientsOnCalendars.deleteMany(args);
	};
}

export default new CalendarServices();
