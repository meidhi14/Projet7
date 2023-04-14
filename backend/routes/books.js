const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// --- Envoyer un livre ---
router.post("/", auth, multer, bookCtrl.sendBook);

// --- Récuperer tous les livres ---
router.get("/", bookCtrl.getAllBook);

// --- Récuperer les trois meilleur livre ---
router.get("/bestrating", bookCtrl.getBestBooks);

// --- Récuperer un livre avec son id ---
router.get("/:id", bookCtrl.getOneBook);

// --- Modifier un livre avec son id ---
router.put("/:id", auth, multer, bookCtrl.modifyOneBook);

// --- Supprimer un livre avec son id ---
router.delete("/:id", auth, bookCtrl.deleteOneBook);

// --- Envoyer une note ---
router.post("/:id/rating", auth, bookCtrl.sendRate);

module.exports = router;
