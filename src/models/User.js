import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  //유저는 다수의 video를 가질 수 있으므로 []을 만들고 ref로 Video와 연결
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

userSchema.pre("save", async function () {
  //this는 userController에서 create되는 user를 가리킴
  //create되고 pre를 통해 save전에 비밀번호를 해시화함

  /*password를 변경할 때만 hash를 하게 함. 이걸 하지 않으면 save()실행시 password를
  해시화 해서 로그아웃후에 다시 로그인이 불가능하게 됨*/
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
