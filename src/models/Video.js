import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  //비디오 형식 설정
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },
  //Date.now에 ()를 안하는 이유는 바로 실행시키지 않기 위해서
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

videoSchema.static("fortmatHastags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
