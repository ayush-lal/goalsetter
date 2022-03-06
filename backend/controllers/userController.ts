import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel";

// @description: Register New User
// @route: POST /api/users
// @access: Public
export const registerUser = asyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  res.json({ message: "registerUser" });
});

// @description: Authenticate User
// @route: POST /api/users/login
// @access: Public
export const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @description: Get User Data
// @route: GET /api/users/me
// @access: Private
export const getUser = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
});

// generate JWT
export const generateToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};
