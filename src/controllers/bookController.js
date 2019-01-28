var mongoClient = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
    function getIndex(req, res) {
        console.log(`in book controller`);
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

                var col = await db.collection('books');
                const books = await col.find().toArray();
                debug('Get books from mongodb');
                console.log(`Get books from mongodb ${books}`)
                res.render(
                    'booksView', {
                        nav,
                        title: 'Books',
                        books: books
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
            client.close();

        }())
    }

    function getById(req, res) {
        var id = req.params.id;
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

                var col = await db.collection('books');
                console.log(`get book id ${id}`)
                console.log(`get object ID ${ new objectID(id)}`)
                const book = await col.findOne({
                    _id: new objectID(id)
                });
                console.log(`get single book from mongo ${book}`);
                debug(book);

                book.details = await bookService.getBookById(book.bookId);
                res.render(
                    'bookListView', {
                        nav,
                        title: 'Book',
                        book: book
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
        }())
    }

    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }
    return {
        getIndex,
        getById,
        middleware
    };

}

module.exports = bookController