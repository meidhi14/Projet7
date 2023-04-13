const express = require("express");

const app = express();

// --- Connection à la base de donnée avec le code fourni par le site ---

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://meidhi:12345@cluster0.byaksxe.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// --- Fin de la connection ---

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "Objet créé !" });
});

app.get("/api/books", (req, res, next) => {
  const books = [
    {
      userId: "1",
      title: "mon premier livre",
      author: "Meidhi",
      imageUrl: "illustration/couverture du livre",
      year: 2022,
      genre: "genre du livre",
      ratings: [
        {
          userId:
            "identifiant MongoDB unique de l'utilisateur qui a noté le livre",
          grade: 4,
        },
      ],
      averageRating: 4,
    },
    {
      userId: "2",
      title: "Mon deuxième livre",
      author: "Mélanie",
      imageUrl: "illustration/couverture du livre",
      year: 2023,
      genre: "genre du livre",
      ratings: [
        {
          userId:
            "identifiant MongoDB unique de l'utilisateur qui a noté le livre",
          grade: 4,
        },
      ],
      averageRating: 4,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
