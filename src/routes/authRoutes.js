var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var debug = require('debug')('app:authRoutes');
var passport = require('passport');

var authRouter = express.Router();
function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
        var { username, password } = req.body;
        var url = 'mongodb://127.0.0.1:27017';
        var dbName = 'libraryApp';
        (async function addUser(){
          let client;
          try {
            client = await mongoClient.connect(url);
            const db = client.db(dbName);
            const col = db.collection('users');
            const user = { username, password};
            const results = await col.insertOne(user);
            debug(results);
            req.login(results.ops[0], ()=> {
                res.redirect('/auth/profile');
            });
          } catch(err) {
            debug(err);
          }
        }());
    });
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
          next();
      } else {
          res.redirect('/');
      }
    })
    .get((req, res) => {
        res.json(req.user);
    });
  authRouter.route('/signIn')
    .get((req, res) => {
        res.render('signin', {
            nav,
            title: 'signIn'
        });
    }).post(passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
    }));
    return authRouter;
};

module.exports = router;