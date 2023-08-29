import { config } from "dotenv";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const uploadFileToS3 = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "",
    key: function (req, file, cb) {
      let extension = file.originalname.split(".").pop();
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

const getImage = async (imageName,expires = null) => {
  try {
    let data = await s3.getObject({ Bucket: bucketName, Key: imageName, Expires: expires || 30}).promise();
    return encode(data.Body);
  }
  catch(e) {}
};

const encode = (data) => {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64
}

const s3Bucket = { getImage, uploadFileToS3 };
export default s3Bucket;
