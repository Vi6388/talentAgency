const UserModel = require("../model/User.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: 'All fields are required' })
    }
    const user = await UserModel.findOne({ email: email });
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
    return res.json({ status: 200, message: "User logged in successfully", success: true, data: user });
    next()
  } catch (error) {
    console.error(error);
  }
}