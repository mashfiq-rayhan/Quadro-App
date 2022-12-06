import { Router } from "express";
import appointmentRouter from "./appointment/appointment.routes";
import classRouter from "./classService/class.routes";
import serviceRouter from "./service/index.routes";
const servicesRouter: Router = Router();

servicesRouter.use("/appointments", appointmentRouter);
servicesRouter.use("/class", classRouter);
servicesRouter.use("", serviceRouter);

export default servicesRouter;
