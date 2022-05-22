const { pool } = require("../config/db");
const fs = require("fs");

exports.getAll = (req, res, next) => {
  // TOUT LES POST DU DERNIER AU PREMIER
  let sql = "SELECT * FROM post ORDER BY date DESC";
  pool.execute(sql, function (err, result) {
    if (err) res.status(400).json({ e });
    console.log(result);
    res.status(200).json(result);
  });
};

exports.create = (req, res, next) => {
  // DEFINI LES CHAMPS REMPLI
  const image = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "";
  const textSend = req.body.post ? req.body.post.text : " ";
  const post = {
    text: textSend,
    imageUrl: image,
    like: 0,
    date: new Date().toLocaleString("af-ZA", { timeZone: "Europe/Paris" }),
  };
  //ENVOIE LA REQUETE AVEC MULTER ET LES VALEURS PAR DEFAUT
  let sql = `INSERT INTO post (text, imageUrl, date) VALUES ("${post.text}","${post.imageUrl}","${post.date}");`;
  pool.execute(sql, function (err, result) {
    if (err) throw err;
    res.status(201).json({ message: `Post ajouté` });
  });
};

exports.delete = (req, res, next) => {
  let sql = `SELECT * FROM post WHERE id = ${req.params.id}`;
  pool.execute(sql, function (err, result) {
    if (err) res.status(400).json({ e });
    if (!result[0])
      res.status(400).json({ message: "Aucun id ne correspond dans la table" });
    else {
      // SI LE POST A UNE IMAGE, LA SUPPRIMER DU DOSSIER IMAGES
      if (result[0].imageUrl != "") {
        const name = result[0].imageUrl.split("/images/")[1];
        fs.unlink(`images/${name}`, () => {
          if (err) console.log(err);
          else console.log("Image supprimée !");
        });
      }
      // SUPPRIME LE POST DANS LA DB
      let sql2 = `DELETE FROM post WHERE id = ${req.params.id}`;
      pool.execute(sql2, function (err, result) {
        if (err) throw err;
        res.status(201).json({ message: `Post supprimé` });
      });
    }
  });
};

exports.modify = (req, res, next) => {
  if (req.file) {
    let sql = `SELECT * FROM post WHERE id = ${req.params.id}`;
    pool.execute(sql, function (err, result) {
      if (err) res.status(400).json({ e });
      if (!result[0])
        res
          .status(400)
          .json({ message: "Aucun id ne correspond dans la table" });
      else {
        // SI LE POST A UNE IMAGE, LA SUPPRIMER DU DOSSIER IMAGES
        if (result[0].imageUrl != "") {
          const name = result[0].imageUrl.split("/images/")[1];
          fs.unlink(`images/${name}`, () => {
            if (err) console.log(err);
            else console.log("Image modifiée !");
          });
        }
        // RECUPERE LES INFOS ENVOYER PAR LE FRONT
        const image = req.file
          ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          : "";
        const textSend = req.body.post ? req.body.post.text : " ";
        const post = {
          text: textSend,
          imageUrl: image,
          date: new Date().toLocaleString("af-ZA", {
            timeZone: "Europe/Paris",
          }),
        };
        // UPDATE LA DB
        let sql2 = `UPDATE post
                SET text = '${post.textSend}', imageUrl= '${post.imageUrl}', date = '${post.date}'
                WHERE id = ${req.params.id}`;
        pool.execute(sql2, function (err, result) {
          if (err) throw err;
          res.status(201).json({ message: `Post udpate` });
        });
      }
    });
  } else {
    // RECUPERE LES INFOS ENVOYER PAR LE FRONT
    const textSend = req.body.post ? req.body.post.text : " ";
    const post = {
      text: textSend,
      date: new Date().toLocaleString("af-ZA", { timeZone: "Europe/Paris" }),
    };
    // UPDATE LA DB
    let sql2 = `UPDATE post
                SET text = '${post.text}', date = '${post.date}'
                WHERE id = ${req.params.id}`;
    pool.execute(sql2, function (err, result) {
      if (err) throw err;
      res.status(201).json({ message: `Post update` });
    });
  }
};
