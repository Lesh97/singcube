import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithunLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

//get과 post(delete,put) 모든 곳에 protectorMiddleware를 사용하겠다는 뜻 -> all()
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter.get("/logout", protectorMiddleware, logout);

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithunLogin);

userRouter.get("/:id", see);

export default userRouter;
