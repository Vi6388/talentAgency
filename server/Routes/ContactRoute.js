const { getContactList, createContact, updateContact, deleteContact, getContactListByClientId } = require("../Controller/ContactController");
const router = require("express").Router();

router.get("/list", getContactList);
router.get("/getContactListByClientId/:clientId", getContactListByClientId);

router.post('/add', createContact);
router.post('/update/:id', updateContact);
router.delete('/delete/:id', deleteContact);

module.exports = router;