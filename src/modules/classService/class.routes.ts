import { Router } from "express";
import { createClassSchema, classParamsSchema, updateClassSchema } from "./class.schema";
import { validateResource } from "@src/middlewares";
import * as classController from "./class.controllers";

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
				location: `string (optional) default : empty string `,
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
		},
	}),
);

classRouter.get("/", classController.handelGetAll);

classRouter.get("/:id", [validateResource(classParamsSchema)], classController.handelGet);

classRouter.post("/", [validateResource(createClassSchema)], classController.handelCreate);

classRouter.put("/:id", [validateResource(updateClassSchema)], classController.handelUpdate);

classRouter.delete("/:id", [validateResource(classParamsSchema)], classController.handleDelete);

export default classRouter;
