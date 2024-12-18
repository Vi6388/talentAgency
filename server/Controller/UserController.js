const UserModel = require("../Model/User.model");
const bcrypt = require('bcrypt');

module.exports.getUserList = async (req, res, next) => {
  try {
    const userList = await UserModel.find();
    return res.json({ status: 200, message: "Get User list", success: true, data: userList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.UserAdd = async (req, res, next) => {
  try {
    const url = req.protocol + '://' + req.get("host");
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ success: true, status: 201, message: "User already exists" });
    }
    const data = req.body;
    if (req.body.password !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      data.password = hashedPassword;
    }
    const user = UserModel.create({
      firstname: data.firstname || "",
      surname: data.surname || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      username: data.username || "",
      password: data.password || "",
      type: data.type || 'user',
      avatar: url + '/uploads/user/' + req.file.filename
    });
    return res.json({ status: 200, message: "User added successfully", success: true, data: user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      return res.json({ success: true, status: 200, message: "User is exist", data: user });
    } else {
      return res.json({ success: true, status: 201, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UserUpdate = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const url = req.protocol + '://' + req.get("host");
    var data = req.body;
    if (req.body.password !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      data.password = hashedPassword;
    }
    if (req.file !== undefined) {
      data.avatar = url + '/uploads/user/' + req.file.filename;
    }
    if (req.body.avatar === 'undefined') {
      data.avatar = user.avatar;
    }
    console.log(data);
    await UserModel.findById(req.params.id).updateMany({
      firstname: data.firstname || user.firstname,
      surname: data.surname || user.surname,
      email: data.email || user.email,
      phoneNumber: data.phoneNumber || user.phoneNumber,
      username: data.username || user.username,
      password: data.password || user.password,
      type: data.type || user.type,
      avatar: data.avatar
    });
    res.json({ status: 200, success: true, user: user, message: "User updated successfully." });
  } catch (err) {
    next(err);
  }
};
