const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// --- Envoyer un livre ---
router.post("/", auth, multer, bookCtrl.sendBook);

// --- Récuperer tous les livres ---
router.get("/", bookCtrl.getAllBook);

// --- Récuperer un livre avec son id ---
router.get("/:id", bookCtrl.getOneBook);

// --- Modifier un livre avec son id ---
router.put("/:id", auth, bookCtrl.modifyOneBook);

// --- Supprimer un livre avec son id ---
router.delete("/:id", auth, bookCtrl.deleteOneBook);

module.exports = router;
