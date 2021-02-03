require('dotenv').config()
const { getPostgresClient } = require("./postgres.js");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");

const stringMethods = require("./utils/string.js");

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

/** Connect to the database then start the API server */

/**
 * 
 * IM USING JS BECAUSE TYPESCRIPT WITH ES5 IS LIKE RIDING A BIKE WITH NO WHEELS
 * 
 */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests please wait a little bit"
});

app.use(limiter);

getPostgresClient()
  .then((pgClient) => {
    const app = express();

    app.use(morgan("combined"));
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.use(require("sanitize").middleware);
    app.use(cors());

    app.get("/", (req, res) => {
      res.send("Hello world!  d fsadf");
    });

    app.get("/queryCategories", async (req, res) => {
      pgClient.query("SELECT * FROM collection", (err, query) => {
        if (err) {
          res.status(400).json("Error on our end please try again later");
        }
        if (query.rows) {
          res.status(200).json(query.rows);
        } else {
          res.status(400).json("Error on our end please try again later");
        }
      });
    });

    app.post("/send-search", async (req, res) => {

      const sanitizedString =  stringMethods.sanitizeString(req.body.searchBody);
      /**
       * YES ITS OPEN TO MYSQL INJECTIONS. I dont have the time but I would have used mysql FORMAT 
       */

      
      if (
        sanitizedString === undefined &&
        req.body.searchCategory === undefined
      ) {
        pgClient.query(
          "SELECT * FROM photo" +
            " JOIN collection ON (photo.collection_id = collection.id)" +
            " JOIN photographer ON (photo.photographer_id = photographer.id)",
          (err, query) => {
            if (err) {
              res.status(400).json("Error on our end please try again later");
            }

            if (query) {
              res.status(200).json(query.rows);
            } else {
              res.status(400).json("Error on our end please try again later");
            }
          }
        );
      } //NO STRING INPUT && CATEGORY
      if (sanitizedString === undefined && req.body.searchCategory) {
        pgClient.query(
          "SELECT * FROM photo" +
            " JOIN collection ON (photo.collection_id = collection.id)" +
            " JOIN photographer ON (photo.photographer_id = photographer.id)" +
            ` WHERE collection.title = '` +
            req.body.searchCategory +
            `'`,
          // FORMAT('%s, %s',last_name, first_name)
          (err, query) => {
            if (err) {
              res.status(400).json("Error on our end please try again later");
            }

            if (query) {
              res.status(200).json(query.rows);
            } else {
              res.status(400).json("Error on our end please try again later");
            }
          }
        );//NO INPUT && BUT CATEGORY IS PRESENT
      } else if (req.body.searchCategory === undefined && sanitizedString) {
        pgClient.query(
          "SELECT * FROM photo" +
            " JOIN collection ON (photo.collection_id = collection.id)" +
            " JOIN photographer ON (photo.photographer_id = photographer.id)" +
            ` WHERE to_tsvector(CONCAT(photo.description, '' ,photographer.name, '' ,photographer.location, '' ,photographer.bio, '' ,photographer.name, '' ,photographer.twitter_username, '' ,photographer.instagram_username)) @@ to_tsquery('` +
            sanitizedString +
            `')`,
          (err, query) => {
            if (err) {
              res.status(400).json("Error on our end please try again later");
            }

            if (query) {
              res.status(200).json(query.rows);
            } else {
              res.status(400).json("Error on our end please try again later");
            }
          }
        );//BOTH
      } else if (req.body.searchCategory && sanitizedString) {
        pgClient.query(
          "SELECT * FROM photo" +
            " JOIN collection ON (photo.collection_id = collection.id)" +
            " JOIN photographer ON (photo.photographer_id = photographer.id)" +
            ` WHERE collection.title = '` +
            req.body.searchCategory +
            `' AND to_tsvector(CONCAT(photo.description, '' ,photographer.name, '' ,photographer.location, '' ,photographer.bio, '' ,photographer.name, '' ,photographer.twitter_username, '' ,photographer.instagram_username)) @@ to_tsquery('` +
            sanitizedString +
            `')`,
          (err, query) => {
            if (err) {
              res.status(400).json("Error on our end please try again later");
            }
            if (query) {
              res.status(200).json(query.rows);
            } else {
              res.status(400).json("Error on our end please try again later");
            }
          }
        );
      }
    });

    app.listen(process.env.PORT || 8080, () => {
      console.log("API server ready at http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("Error connecting to postgres: ", err);
  });

//add
