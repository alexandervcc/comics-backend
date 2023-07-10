import mongoose, { ValidatorProps } from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: (res: ValidatorProps) =>
        `${res.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    minLength: [5, "Username too short"],
  },
  activated: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserModel = mongoose.model("user", schema);

export default UserModel;
