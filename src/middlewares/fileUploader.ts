import config from "config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";

const aws_access_id = config.get<string>("aws_access_id");
const aws_access_secret = config.get<string>("aws_access_secret");
const aws_default_region = config.get<string>("aws_default_region");
const aws_bucket = config.get<string>("aws_bucket");
const aws_endpoint = config.get<string>("aws_endpoint");

export const s3 = new S3({
	endpoint: aws_endpoint,
	credentials: {
		accessKeyId: aws_access_id,
		secretAccessKey: aws_access_secret,
	},
	region: aws_default_region,
});

const storage = multerS3({
	s3,
	bucket: aws_bucket,
	contentType: multerS3.AUTO_CONTENT_TYPE,
	acl: "public-read",
	metadata: (req, file, cb) => {
		cb(null, { fieldName: file.fieldname });
	},
	key: (req, file, cb) => {
		const { folder } = req.query;
		const fileName = `${folder ? folder : "default"}/${Date.now().toString()}-${file.originalname}`;
		console.log(`[image] uploading ${fileName}`);
		cb(null, fileName);
	},
});

export const upload = multer({ storage });
