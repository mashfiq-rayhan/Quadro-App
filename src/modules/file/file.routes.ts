import { Router } from "express";
import config from "config";
import requireUserHandler from "@middlewares/requireUserHandler";
import { upload, s3 } from "@middlewares/fileUploader";
import { returnVal } from "@utils/return";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "@src/errors/CustomError";
import { ErrorCodes } from "@src/errors/ErrorCodes";

const aws_bucket = config.get<string>("aws_bucket");

class FilesRouter {
	public router: Router;
	private test: string = "file router OK";

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(200).send(this.test));

		this.router.post("/single-upload", [requireUserHandler, upload.single("file")], (req, res, next) => {
			if (req.file) {
				const { location } = req.file;
				const file = { ...req.file, location: location.replace("http://", "https://") };
				console.log(`[image] uploaded: ${JSON.stringify(file)}`);
				return res.status(StatusCodes.CREATED).json(returnVal(file));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.INTERNAL_SERVER_ERROR,
						description: "Something went wrong. File didn't uploaded.",
					}),
				);
			}
		});

		this.router.post("/multi-upload", [upload.array("files")], (req, res, next) => {
			if (req.files) {
				const files: Record<string, any>[] = [];
				req.files.forEach((file) => {
					const { location } = file;
					const f: Record<string, any> = { ...file, location: location.replace("http://", "https://") };
					console.log(`[image] uploaded: ${JSON.stringify(f)}`);
					files.push(f);
				});

				return res.status(StatusCodes.CREATED).json(returnVal(files));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.CrudError,
						status: StatusCodes.INTERNAL_SERVER_ERROR,
						description: "Something went wrong. Files didn't uploaded.",
					}),
				);
			}
		});

		this.router.delete("/remove", [requireUserHandler], async (req, res, next) => {
			const { key } = req.query;

			if (key) {
				const params = { Bucket: aws_bucket, Key: key as string };

				let file;

				try {
					file = await s3.headObject(params);
					console.log(file);
				} catch (error) {
					return next(
						new CustomError({
							code: ErrorCodes.NotFound,
							status: StatusCodes.NOT_FOUND,
							description: "File not found.",
						}),
					);
				}

				if (file) {
					try {
						console.log(`[image] deleting ${key}`);
						await s3.deleteObject(params);
					} catch (error) {
						console.log(error);
						return next(
							new CustomError({
								code: ErrorCodes.CrudError,
								status: StatusCodes.INTERNAL_SERVER_ERROR,
								description: "Something went wrong. Could not delete file.",
							}),
						);
					}
				}

				return res.status(StatusCodes.NO_CONTENT).json(returnVal({ message: "File deleted" }));
			} else {
				return next(
					new CustomError({
						code: ErrorCodes.VerificationError,
						status: StatusCodes.BAD_REQUEST,
						description: "You must provide file key to delete.",
					}),
				);
			}
		});
	};
}

const filesRouter = new FilesRouter();

export default filesRouter.router;
