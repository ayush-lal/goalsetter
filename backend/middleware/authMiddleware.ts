import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel";

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("not authorized, no token");
  }
});
