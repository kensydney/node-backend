var passport = require('passport');
var strategy = require('passport-local');
var mongoClient = require('mongodb').MongoClient;
var debug = require('debug')('app:authRoutes');

module.exports = function localStrategy() {
    passport.use(new strategy(
     {
         usernameField: 'username',
         passwordField: 'password'
     }, (username, password, done) => {
        var url = 'mongodb://127.0.0.1:27017';
        var dbName = 'libraryApp';
        (async function mongo(){
          let client;
          try {
            client = await mongoClient.connect(url);
            const db = client.db(dbName);
            const col = db.collection('users');
            console.log(`user name before mongo ${username}`);
            const user = await col.findOne({ username });
            console.log(`get user from mongo ${user}`);
            console.log(`get user name from mongo ${user.username}`);
            if(user.password === password){
                done(null, user)
            }else {
                done(null, false);
            }
          } catch(err) {
            debug(err);
          }
          client.close();
        }());
     }
    ));
};

