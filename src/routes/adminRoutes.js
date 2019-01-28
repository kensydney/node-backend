var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var debug = require('debug')('app:adminRoutes');
var adminRouter = express.Router();

var books = [{
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    bookId: 656,
    read: false
  },
  {
    title: 'Les Miserable',
    genre: 'Commodity',
    author: 'Lev Nikolayevich Tolstoy',
    bookId: 24280,
    read: false
  }
];

function router(nav) {
  console.log('in admin router');
  adminRouter.route('/')
    .get((req, res) => {
      console.log('before connect to mongo');
      var url = 'mongodb://127.0.0.1:27017';
      var dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          console.log(`set mongo properties ${dbName}`)
          client = await mongoClient.connect(url);
          console.log('connect to mongo correctly');
          debug('Connected correctly to server');

          var db = client.db(dbName);

          var response = await db.collection('books').insertMany(books);
          console.log(`mongo response: ${response}`)
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
      }())
    });
  return adminRouter;
}

module.exports = router;