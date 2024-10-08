const TalentModel = require("../Model/Talent.model");

module.exports.getTalentList = async (req, res, next) => {
  try {
    const talentList = await TalentModel.find();
    return res.json({ status: 200, message: "Get Talent list", success: true, data: talentList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.AddTalent = async (req, res, next) => {
  try {
    const url = req.protocol + '://' + req.get("host");
    const existingTalent = await TalentModel.findOne({ email: req.body.email });
    if (existingTalent) {
      return res.json({ success: true, status: 201, message: "Talent already exists" });
    }
    const talent = TalentModel.create({
      ...req.body,
      avatar: url + '/uploads/talent/' + req.file.filename
    });
    return res.json({ status: 200, message: "Talent added successfully", success: true, data: talent });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getTalentById = async (req, res, next) => {
  try {
    const talent = await TalentModel.findById(req.params.id);
    if (talent) {
      return res.json({ success: true, status: 200, message: "Talent is exist", data: talent });
    } else {
      return res.json({ success: true, status: 201, message: "Talent not found" });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateTalent = async (req, res, next) => {
  try {
    const talent = await TalentModel.findById(req.params.id);
    const url = req.protocol + '://' + req.get("host");
    var data = req.body;
    if(req.file !== undefined) {
      data.avatar = url + '/uploads/talent/' + req.file.filename;
    }
    if(req.body.avatar === 'undefined') {
      data.avatar = talent.avatar;
    }
    await TalentModel.findById(req.params.id).updateMany(data);
    res.json({ status: 200, success: true, talent: talent, message: "Talent updated successfully." });
  } catch (err) {
    next(err);
  }
};
