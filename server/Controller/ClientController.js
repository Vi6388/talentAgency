const ClientModel = require("../Model/Client.model");

module.exports.getClientList = async (req, res, next) => {
  try {
    const clientList = await ClientModel.find();
    return res.json({ status: 200, message: "Get Client list", success: true, data: clientList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.AddClient = async (req, res, next) => {
  try {
    const url = req.protocol + '://' + req.get("host");
    const existingClient = await ClientModel.findOne({ email: req.body.email });
    if (existingClient) {
      return res.json({ success: true, status: 201, message: "Client already exists" });
    }
    const client = ClientModel.create({
      ...req.body,
      avatar: url + '/uploads/client/' + req.file.filename
    });
    return res.json({ status: 200, message: "Client added successfully", success: true, data: client });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getClientById = async (req, res, next) => {
  try {
    const client = await ClientModel.findById(req.params.id);
    if (client) {
      return res.json({ success: true, status: 200, message: "Client is exist", data: client });
    } else {
      return res.json({ success: true, status: 201, message: "Client not found" });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateClient = async (req, res, next) => {
  try {
    const client = await ClientModel.findById(req.params.id);
    const url = req.protocol + '://' + req.get("host");
    var data = req.body;
    if(req.file !== undefined) {
      data.avatar = url + '/uploads/client/' + req.file.filename;
    }
    if(req.body.avatar === 'undefined') {
      data.avatar = client.avatar;
    }
    await ClientModel.findById(req.params.id).updateMany(data);
    res.json({ status: 200, success: true, client: client, message: "Client updated successfully." });
  } catch (err) {
    next(err);
  }
};
