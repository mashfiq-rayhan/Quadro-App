import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import calendarControllers, { CalendarControllers } from "@modules/calendar/calendar.controllers";
import blockControllers, { BlockControllers } from "@modules/block/block.controllers";
import requireUserHandler from "@middlewares/requireUserHandler";

class CalendarRouter {
	public router: Router;
	private calendarControllers: CalendarControllers = calendarControllers;
	private blockControllers: BlockControllers = blockControllers;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(StatusCodes.OK).send("Calendar router OK"));

		this.router.post("/", [requireUserHandler], this.calendarControllers.createCalendar);

		this.router.post(
			"/payment/:calendarId/:clientId",
			[requireUserHandler],
			this.calendarControllers.updatePaymentCalendar,
		);

		this.router.post("/with-block", [requireUserHandler], this.calendarControllers.createBlockWithCalendar);

		this.router.get("/block", [requireUserHandler], this.blockControllers.getBlocks);

		this.router.get("/block/:id", [requireUserHandler], this.blockControllers.findBlock);

		this.router.put("/block/:id", [requireUserHandler], this.blockControllers.updateBlock);

		this.router.delete("/block/:id", [requireUserHandler], this.blockControllers.deleteBlock);

		this.router.get("/my", [requireUserHandler], this.calendarControllers.getMyCalendars);

		this.router.get("/", this.calendarControllers.getCalendars);

		this.router.get("/:id", this.calendarControllers.findCalendar);

		this.router.put(
			"/remove-participants/:id",
			[requireUserHandler],
			this.calendarControllers.removeParticipantFromCalendar,
		);

		this.router.get(
			"/get-participants/:id",
			[requireUserHandler],
			this.calendarControllers.getCalendarParticipants,
		);

		this.router.get("/my/:id", [requireUserHandler], this.calendarControllers.findMyCalendar);

		this.router.delete("/:id", this.calendarControllers.deleteCalendar);

		this.router.delete("/my/:id", [requireUserHandler], this.calendarControllers.deleteMyCalendar);
	};
}

export default new CalendarRouter().router;
