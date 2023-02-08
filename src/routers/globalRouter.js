import express from "express";
import { homepage } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
