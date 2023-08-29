import userAdminModel from "../../database/models/user.admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
// import s3 from "../utils/s3.js";

const registerAdminUser = async (req) => {
  const { fullName, email, password } = req.body;
  const hashedpassword = await bcrypt.hash(password, 18);
  const emailExist = await userAdminModel.findOne({ email });
  if (emailExist) {
    const error = new Error(`Email already exist`);
    error.statusCode = 400;
    throw error;
  }
  const createdUser = await userAdminModel.create({
    fullName: fullName,
    email: email,
    password: hashedpassword,
  });
  return { data: { fullName: createdUser.fullName } };
};

const signinAdminUser = async (req) => {
  const { email, password } = req.body;

  const userDetail = await userAdminModel.findOne({ email });
  if (!userDetail) {
    const error = new Error(`Invalid email address`);
    error.statusCode = 400;
    throw error;
  }

  const isEqual = bcrypt.compare(password, userDetail.password);
  if (!isEqual) {
    const error = new Error("Wrong Password!");
    error.statusCode = 402;
    throw error;
  }
  const token = jwt.sign(
    {
      email: userDetail.email,
      userId: userDetail._id.toString(),
    },
    process.env.JWT_SECRET, // this for our secuerity mechanism it's a private key for signing in
    { expiresIn: "100d" }
  ); // here token expires in 100days

  return { data: { token: token, userId: userDetail._id.toString() } };
};

const AuthService = {
  registerAdminUser,
  signinAdminUser,
};
export default AuthService;
