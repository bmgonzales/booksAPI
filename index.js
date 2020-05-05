const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/booklistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bookSchema = {
    title: String,
    author: String,
    year: Number,
    summary: String
};

const Book = mongoose.model("Book", bookSchema);

const authorSchema = {
    name: String,
    dob: String,
    country: String
}

const Author = mongoose.model("Author", authorSchema);



app.get("/", function(req, res, next) {
    res.send("Hello World")
});


/////// Books - all /////////
app.route("/books")

.get(function(req, res){
    Book.find(function(err, books) {
        if (books) {
            res.send(books);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const newBook = Book({
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        summary: req.body.summary
    });

    newBook.save(function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added new book");
        }
    });

})

.delete(function(req, res) {
    Book.deleteMany(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted all books in the database");
        }
    });
});



/////// Books - by author /////////
app.route("/books/:bookAuthor")

.get(function(req, res) {
    const bookAuthor = req.params.bookAuthor;
    Book.find({author: bookAuthor}, function(err, author) {
        if (author) {
            res.send(author);
        } else {
            res.send(`${bookAuthor} not found in database`);
        }
    });
})

.delete(function(req, res) {
    const bookAuthor = req.params.bookAuthor;
    Book.find(
        {author: bookAuthor},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully deleted all books by ${bookAuthor}`);
            }
        });
});




/////// Books - by title /////////
app.route("/books/:bookTitle")

.get(function(req, res) {
    const bookTitle = req.params.bookTitle;
    Book.findOne({title: bookTitle}, function(err, book) {
        if (book) {
            res.send(book);
        } else {
            res.send(`${bookTitle} not found in database`);
        }
    });
})

.patch(function(req, res) {
    const bookTitle = req.params.bookTitle;
    Book.update(
        {title: bookTitle},
        {$set: req.body},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully updated ${bookTitle}`);
            }
        });
})

.put(function(req, res) {
    const bookTitle = req.params.bookTitle;
    Book.update(
        {title: bookTitle},
        {title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        summary: req.body.summary},
        {overwrite: true},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully updated ${bookTitle}`);
            }
        });
})

.delete(function(req, res) {
    const bookTitle = req.params.bookTitle;
    Book.findOneAndDelete(
        {title: bookTitle},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully deleted ${bookTitle}`);
            }
        });
});


/////// Authors - all /////////
app.route("/authors")

.get(function(req, res){
    Author.find(function(err, authors) {
        if (authors) {
            res.send(authors);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const newAuthor = Author({
        name: req.body.name,
        dob: req.body.dob,
        country: req.body.country
    });

    newAuthor.save(function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added new author");
        }
    });

})

.delete(function(req, res) {
    Author.deleteMany(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted all authors in the database");
        }
    });
});

/////// Authors - by name /////////
app.route("/authors/:authorName")

.get(function(req, res) {
    const authorName = req.params.authorName;
    Author.findOne({name: authorName}, function(err, author) {
        if (author) {
            res.send(author);
        } else {
            res.send(`${authorName} not found in database`);
        }
    });
})

.patch(function(req, res) {
    const authorName = req.params.authorName;
    Author.update(
        {name: authorName},
        {$set: req.body},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully updated ${authorName}`);
            }
        });
})

.put(function(req, res) {
    const authorName = req.params.authorName;
    Author.update(
        {name: authorName},
        {name: authorName,
        dob: req.body.dob,
        country: req.body.country},
        {overwrite: true},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully updated ${authorName}`);
            }
        });
})

.delete(function(req, res) {
    const authorName = req.params.authorName;
    Author.findOneAndDelete(
        {name: authorName},
        function(err){
            if (err) {
                res.send(err);
            } else {
                res.send(`Successfully deleted ${authorName}`);
            }
        });
});


app.listen(3000, function() {
    console.log("Server running on port 3000");
});