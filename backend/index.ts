import express from "express";
import dotenv from "dotenv";
const { errorHandler } = require("./middleware/errorMiddleware");
import { connectDatabase } from "./config/db";
import { router } from "./routes/goalRoutes";
import { User } from "./routes/userRoutes";

dotenv.config();

const port = process.env.PORT;

connectDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/goals", router);
app.use("/api/users", User);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
