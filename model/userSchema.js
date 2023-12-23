const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "already register"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpriyaDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  JWTToken() {
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: "24h",
    });
  },
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
