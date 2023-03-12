import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ rating: "desc" })
      .populate("owner");
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("error-server", { error });
  }
};

export const hotpage = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ views: "desc" })
      .populate("owner");
    res.render("hotpage", { pageTitle: "Hot", videos });
  } catch (error) {
    return res.render("error-server", { error });
  }
};

export const newpage = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    res.render("newpage", { pageTitle: "New", videos });
  } catch (error) {
    return res.render("error-server", { error });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "영상을 찾지 못했습니다." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "영상을 찾지 못했습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "영상을 찾지 못했습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "동영상의 소유자가 아닙니다.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.fortmatHastags(hashtags),
  });
  req.flash("success", "변경이 완료되었습니다.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "영상 수정/추가" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner: _id,
      hashtags: Video.fortmatHastags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "영상 수정/추가",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "영상을 찾지 못했습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "검색", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const { id, videoid } = req.body;
  const { _id } = req.session.user;
  const { owner } = await Comment.findById(id);
  const video = await Video.findById(videoid);
  if (String(owner) !== _id) return res.sendStatus(403);
  else {
    await Comment.findByIdAndDelete(id);
    video.comments.splice(video.comments.indexOf(videoid), 1);
    video.save();
    return res.sendStatus(200);
  }
};
