const ContactModel = require("../Model/Contact.model");

module.exports.getContactList = async (req, res) => {
  try {
    const contactList = await ContactModel.find();
    return res.json({ status: 200, message: "Get Contact list", success: true, data: contactList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.getContactListByClientId = async (req, res) => {
  try {
    const contactList = await ContactModel.find({ clientId: req.params.id });
    return res.json({ status: 200, message: "Get Contact list By ClientId", success: true, data: contactList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.createContact = async (req, res) => {
  try {
    const data = req.body;
    const newContact = await ContactModel.create({
      clientId: data.clientId,
      firstname: data.firstname || "",
      surname: data.surname || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      position: data.position || "",
    });
    return res.json({ status: 200, message: "Contact created successfully.", success: true, data: newContact });
  } catch (error) {
    console.error(error);
  }
}

module.exports.updateContact = async (req, res) => {
  try {
    const oldContact = await ContactModel.findById(req.params.id);
    const data = req.body;
    await oldContact.updateOne({
      clientId: data.clientId || oldContact?.clientId,
      firstname: data.firstname || oldContact?.firstname,
      surname: data.surname || oldContact?.surname,
      email: data.email || oldContact?.email,
      phoneNumber: data.phoneNumber || oldContact?.phoneNumber,
      position: data.position || oldContact?.position,
    });
    return res.json({ status: 200, message: "Contact updated successfully.", success: true, data: oldContact });
  } catch (error) {
    console.error(error);
  }
}

module.exports.deleteContact = async (req, res) => {
  try {
    await ContactModel.findByIdAndDelete(req.params.id);
    return res.json({ status: 200, message: "Contact deleted successfully.", success: true });
  } catch (error) {
    console.error(error);
  }
}