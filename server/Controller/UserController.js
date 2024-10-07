const UserModel = require("../model/User.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.add = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await UserModel.create(req.body);
    res.status(200).json({ status: 200, message: "User signed in successfully", success: true, data: user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: 'All fields are required' })
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Incorrect password or email' })
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.json({ success: false, message: 'Incorrect password or email' })
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User logged in successfully", success: true });
    next()
  } catch (error) {
    console.error(error);
  }
}