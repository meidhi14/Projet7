const Book = require("../models/Book");

// --- Envoyer un livre ---
exports.sendBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
  console.log(book);
};

// --- Récuperer tous les livres ---
exports.getAllBook = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// --- Récuperer un livre avec son id ---
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// --- Modifier un livre avec son id ---
exports.modifyOneBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// --- Supprimer un livre avec son id ---
exports.deleteOneBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé  !" }))
    .catch((error) => res.status(400).json({ error }));
};

// --- Récuperer les trois meilleur livre ---
exports.getBestBook = (req, res, next) => {};

// --- Envoyer une note ---
exports.sendRate = (req, res, next) => {};
