const ClientModel = require("../Model/Client.model");
const CompanyModel = require("../Model/Company.model");
const ContactModel = require("../Model/Contact.model");

module.exports.getClientList = async (req, res) => {
  try {
    const clientList = await ClientModel.find().populate('companyId');
    return res.json({ status: 200, message: "Get Client list", success: true, data: clientList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.AddClient = async (req, res) => {
  try {
    const companyDetails = req.body;
    const newCompany = await CompanyModel.create({
      companyName: companyDetails?.companyName || "",
      abn: companyDetails?.abn || "",
      postalAddress: companyDetails?.postalAddress || "",
      postalSuburb: companyDetails?.postalSuburb || "",
      postalState: companyDetails?.postalState || "",
      postalPostcode: companyDetails?.postalPostcode || "",
      billingAddress: companyDetails?.billingAddress || "",
      billingSuburb: companyDetails?.billingSuburb || "",
      billingState: companyDetails?.billingState || "",
      billingPostcode: companyDetails?.billingPostcode || "",
      website: companyDetails?.website || "",
      phoneNumber: companyDetails?.phoneNumber || "",
      companyType: companyDetails?.companyType || "",
    });

    const newClient = await ClientModel.create({
      companyId: newCompany?._id,
      notes: req.body.notes,
    });

    return res.json({ status: 200, message: "Client added successfully", success: true, data: newClient });
  } catch (error) {
    console.error(error);
  }
};

module.exports.getClientById = async (req, res, next) => {
  try {
    const client = await ClientModel.findById(req.params.id);
    const company = await CompanyModel.findById(client.companyId);
    if (client) {
      return res.json({ success: true, status: 200, message: "Client is exist", data: { client: client, company: company } });
    } else {
      return res.json({ success: true, status: 201, message: "Client not found" });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateClient = async (req, res, next) => {
  try {
    const oldClient = await ClientModel.findById(req.params.id);
    const oldCompany = await CompanyModel.findById(oldClient?.companyId);
    const companyDetails = req.body;
    await oldCompany.updateOne({
      companyName: companyDetails?.companyName || oldCompany?.companyName,
      abn: companyDetails?.abn || oldCompany?.abn,
      postalAddress: companyDetails?.postalAddress || oldCompany?.postalAddress,
      postalSuburb: companyDetails?.postalSuburb || oldCompany?.postalSuburb,
      postalState: companyDetails?.postalState || oldCompany?.postalState,
      postalPostcode: companyDetails?.postalPostcode || oldCompany?.postalPostcode,
      billingAddress: companyDetails?.billingAddress || oldCompany?.billingAddress,
      billingSuburb: companyDetails?.billingSuburb || oldCompany?.billingSuburb,
      billingState: companyDetails?.billingState || oldCompany?.billingState,
      billingPostcode: companyDetails?.billingPostcode || oldCompany?.billingPostcode,
      website: companyDetails?.website || oldCompany?.website,
      phoneNumber: companyDetails?.phoneNumber || oldCompany?.phoneNumber,
      companyType: companyDetails?.companyType || oldCompany?.companyType,
    });

    await oldClient.updateOne({
      notes: req.body.notes,
    });

    return res.json({ status: 200, success: true, client: oldClient, message: "Client updated successfully." });
  } catch (err) {
    next(err);
  }
};
