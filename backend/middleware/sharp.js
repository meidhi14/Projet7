const sharp = require('sharp');
const fs = require('fs');

// --- Redimensionner les images au max 900px le longueur ---
module.exports = (req, res, next) => {
  if (!req.file) {
    console.log("Pas d'image !");
    return next();
  }
  sharp(req.file.path)
    .metadata()
    .then((metadata) => {
      if (metadata.width > 900) {
        return sharp(req.file.path).resize({ width: 900 }).toBuffer();
      } else {
        return sharp(req.file.path).toBuffer();
      }
    })
    .then((data) => {
      fs.writeFile(req.file.path, data, (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
        next();
      });
    })
    .catch((err) => {
      next(err);
    });
};
