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
exports.modifyOneBook = (req, res, next) => {};

// --- Supprimer un livre avec son id ---
exports.deleteOneBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé  !" }))
    .catch((error) => res.status(400).json({ error }));
};

// --- Récuperer les trois meilleur livre ---
exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// --- Envoyer une note ---
exports.sendRate = (req, res, next) => {
  // --- Nouvelle note à envoyer ---
  const newRating = {
    userId: req.body.userId,
    grade: req.body.rating,
  };
  // --- Envoyer la nouvelle note ---
  Book.updateOne({ _id: req.params.id }, { $push: { ratings: newRating } })
    .then(() => {
      // --- mettre à jour la moyenne ---
      Book.findOne({ _id: req.params.id }).then((book) => {
        let totalRatings = 0;
        let averageRating = 0;
        for (let i = 0; i < book.ratings.length; i++) {
          totalRatings += book.ratings[i].grade;
        }
        averageRating = totalRatings / book.ratings.length;
        Book.updateOne(
          { _id: req.params.id },
          { $set: { averageRating: averageRating } }
        ).then((book) => {
          res.status(200).json({
            message: "Nouvelle note ajoutée et la moyenne est mise à jour !",
            book,
          });
        });
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
