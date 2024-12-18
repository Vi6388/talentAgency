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
    const data = req.body;
    const talent = TalentModel.create({
      avatar: url + '/uploads/talent/' + req.file.filename,
      firstname: data.firstname || "",
      surname: data.surname || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      address: data.address || "",
      suburb: data.suburb || "",
      state: data.state || "",
      postcode: data.postcode || "",
      preferredAirline: data.preferredAirline || "",
      frequentFlyerNumber: data.frequentFlyerNumber || "",
      abn: data.abn || "",
      publicLiabilityInsurance: data.publicLiabilityInsurance || "",
      highlightColor: data.highlightColor || "",
      notes: data.notes || "",
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
    await TalentModel.findById(req.params.id).updateMany({
      avatar: data.avatar,
      firstname: data.firstname || talent.firstname,
      surname: data.surname || talent.surname,
      email: data.email || talent.email,
      phoneNumber: data.phoneNumber || talent.phoneNumber,
      address: data.address || talent.address,
      suburb: data.suburb || talent.suburb,
      state: data.state || talent.state,
      postcode: data.postcode || talent.postcode,
      preferredAirline: data.preferredAirline || talent.preferredAirline,
      frequentFlyerNumber: data.frequentFlyerNumber || talent.frequentFlyerNumber,
      abn: data.abn || talent.abn,
      publicLiabilityInsurance: data.publicLiabilityInsurance || talent.publicLiabilityInsurance,
      highlightColor: data.highlightColor || talent.highlightColor,
      notes: data.notes || talent.notes,
    });
    res.json({ status: 200, success: true, talent: talent, message: "Talent updated successfully." });
  } catch (err) {
    next(err);
  }
};
