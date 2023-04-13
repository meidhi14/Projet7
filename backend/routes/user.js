const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// --- s'inscrire ---
router.post("/signup", userCtrl.signup);
// --- se connecter ---
router.post("/login", userCtrl.login);

module.exports = router;
