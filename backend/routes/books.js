const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");

// --- Envoyer un livre ---
router.post("/", bookCtrl.sendBook);

// --- Récuperer tous les livres ---
router.get("/", bookCtrl.getAllBook);

// --- Récuperer un livre avec son id ---
router.get("/:id", bookCtrl.getOneBook);

// --- Modifier un livre avec son id ---
router.put("/:id", bookCtrl.modifyOneBook);

// --- Supprimer un livre avec son id ---
router.delete("/:id", bookCtrl.deleteOneBook);

module.exports = router;
