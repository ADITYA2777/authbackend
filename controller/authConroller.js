// const userModel = require ('../model/userSchema.js')
const emailValidator = require("email-validator");
const userModel = require("../model/userSchema");
const { use } = require("../router/authRouter");

const signUp = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  /// every field is required
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Every field is required",
    });
  }

  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address 📩",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirm Password does not match ❌",
    });
  }
  try {
    const userInfo = new userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Account already exist with the provided email ${email} 😒`,
      });
    }
    return res.status(400).json({
      message: e.message,
    });
  }
};


const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Every Field mandatory",
    });
  }

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user || user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.JWTToken();
    user.password = undefined;

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};


const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};



const logout = async (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(), // current expiry date
      httpOnly: true, //  not able to modify  the cookie in client side
    };

    // return response with cookie without token
    res.cookie("token", null, cookieOption);
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.stats(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  getUser,
  logout,
};
