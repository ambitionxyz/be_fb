import * as mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  password: { type: String, required: true }, //*
  userName: { type: String, unique: true }, //*
  sex: { type: Number, default: null },
  name: { type: String, default: "" },
  creationTime: { type: String, default: new Date() },
  surname: { type: String, default: "" }, //*
  emailAddress: {
    type: String,
    unique: true,
    require: true,
  },
  phoneNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  isActive: { type: Boolean, default: null },
  roleNames: { type: Array, default: ["USER"] },
  avatarPath: { type: String, default: "" },
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
