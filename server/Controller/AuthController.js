const UserModel = require("../model/User.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

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