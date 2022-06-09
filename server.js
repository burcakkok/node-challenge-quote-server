const { response } = require("express");
const _ = require("lodash");
// server.js
// This is where your node app starts

//load the 'express' module which makes writing webservers easy
const express = require("express");
const app = express();

// Parse JSON bodies for this app. Make sure you put
// àpp.use(express.json())` **before** your route handlers!
app.use(express.json());

// // TODO middleware authorization code

app.use((request, response, next) => {
  if (request.headers['Authorization']) {
    response.sendStatus(401);
  }
  next();
});

const cors = require('cors');
app.use(cors());
// app.use(express.static('screenshots'));

//load the quotes JSON
const quotes = require("./quotes-with-id.json");
let availableId = quotes.length;

// Now register handlers for some routes:
//   /                  - Return some helpful welcome info (text)
//   /quotes            - Should return all quotes (json)
//   /quotes/random     - Should return ONE quote (json)
app.get("/", function (request, response) {
  response.send("Neill's Quote Server!  Ask me for /quotes/random, or /quotes");
});

//START OF YOUR CODE...
// CRUD

app.get('/quotes', function(request, response) {
  response.send(quotes);
});

app.get("/quotes/:quoteId", function (request, response) {
  const quoteId = request.params.quoteId;
  const quote = quotes.find(q => q.id == quoteId);
  if(!quote) {
    response.sendStatus(404);
    return;
  }
  response.send(quote);
});

// CREATE

app.post('/quotes', function(request, response) {
  const {quote, author} = request.body;
  const newQuote = {
    quote: quote,
    author: author,
    id: availableId
  };
  quotes.push(newQuote);
  availableId++;
  response.sendStatus(201);
});

// UPDATE
app.put('/quotes/:quotesId', function(request, response) {
  const quoteId = request.params.quoteId;
  const databaseQuote = quotes.find(q => q.id == quoteId);
  if(!databaseQuote) {
    response.sendStatus(404);
    return;
  }
  const {quote, author} = request.body;
  databaseQuote.quote = quote;
  databaseQuote.author = author;
  response.sendStatus(200);
});

// DELETE

app.delete('/quotes/:quotesId', function(request, response) {
  const quoteId = request.params.quoteId;
  const databaseQuoteIndex = quotes.findIndex(q => q.id == quoteId);
  if(!databaseQuoteIndex) {
    response.sendStatus(404);
    return;
  }
  quotes.splice(databaseQuoteIndex, 1);
  response.sendStatus(200);
});


// app.get('/quotes/random', function(request, response) {
//   response.send(_.sample(quotes));  // lodash
// });

// app.get('/quotes/search', (request, response) => {
//   let term = request.query.term;
//   if (term) {
//     term = term.toLowerCase();
//   }
//   const filteredQuotes = quotes.filter(element => {
//     return element.quote.toLowerCase().includes(term) || element.author.toLowerCase().includes(term);
//   });
//   if(filteredQuotes.length == 0) {
//     response.status(404).send(filteredQuotes);
//   }
//   response.send(filteredQuotes);
// });


//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
// function pickFromArray(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

//Start our server so that it listens for HTTP requests!
let port = 5000;

app.listen( port, function () {
  console.log("Your app is listening on port " + port);
});
