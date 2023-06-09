const Book = require('../models/Book');
const fs = require('fs');

// --- Envoyer un livre ---
exports.sendBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  // --- Sauvegarder le livre ---
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'livre enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// --- Récuperer tous les livres ---
exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
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

// --- Récuperer un livre avec son id ---
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};

// --- Modifier un livre avec son id ---
exports.modifyOneBook = (req, res, next) => {
  let bookObject;
  if (req.file) {
    bookObject = {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non-autorisé !' });
        } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Book.updateOne(
              { _id: req.params.id },
              { ...bookObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: 'Objet modifié !' }))
              .catch((error) => res.status(400).json({ error }));
          });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    bookObject = { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non-autorisé !' });
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// --- Supprimer un livre avec son id ---
exports.deleteOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé !' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
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
        ).then(() => {
          // afficher de nouveau le livre
          Book.findOne({ _id: req.params.id })
            .then((book) => {
              res.status(200).json(book);
            })
            .catch((error) => res.status(404).json({ error }));
        });
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
