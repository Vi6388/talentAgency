const { Login } = require("../Controller/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post('/login', Login);
router.post('/', userVerification);

module.exports = router;