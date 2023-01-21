import { Router } from "express";
import { createClassSchema, classParamsSchema, updateClassSchema } from "./class.schema";
import { validateResource } from "@src/middlewares";
import classController from "./class.controllers";
import requireUserHandler from "@src/middlewares/requireUserHandler";

const classRouter: Router = Router();

classRouter.get("/health", (_, res) => res.status(200).send("Class router OK"));
classRouter.get("/info", (_, res) =>
	res.status(200).send({
		success: true,
		error: null,
		data: {
			info: ` ------ Response object structure will be same as Request object `,
			expectedRequestObject: {
				name: "string",
				location: `enum default : empty BUSINESS |  accepted values : [ CLIENT ,BUSINESS, ONLINE ] `,
				description: `string (optional) default : empty string `,
				price: "number",
				maxNumberOfParticipants: "number",
				duration: "number (optional)",
				published: "boolean (optional)",
				startDateAndTime: "date - string (optional)",
				endDate: "date - string (optional)",
				repeat: {
					week: "number (optional)",
					days: "array of string (optional)",
				},
			},
			daysExample: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
			images: ` array of string(url) optional `,
		},
	}),
);

classRouter.get("/", classController.handelGetAll);

classRouter.get("/all-my-classes", [requireUserHandler], classController.handelGetAllByUser);

classRouter.get("/business/:id", classController.handelGetAllByBusiness);

classRouter.get("/:id", [validateResource(classParamsSchema)], classController.handelGet);

classRouter.post("/", [requireUserHandler, validateResource(createClassSchema)], classController.handelCreate);

classRouter.put("/:id", [requireUserHandler, validateResource(updateClassSchema)], classController.handelUpdate);

classRouter.delete("/:id", [requireUserHandler, validateResource(classParamsSchema)], classController.handleDelete);

export default classRouter;
