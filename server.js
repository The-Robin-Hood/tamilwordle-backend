import express from "express";
import fetch from "node-fetch";
import dbConnect from "./db.js";
import tamilWordle from "./model.js";
import cors from "cors";

dbConnect();

var app = express();

app.use(cors());

async function fetchInternet(word) {
  var resp = await fetch(
    `https://iapi.glosbe.com/iapi3/wordlist?l1=ta&l2=en&q=${word}&after=1`
  );
  var data = await resp.json();
  var check = data.after[0].phrase;
  if (check === word || check.split(" ").includes(word)) {
    saveDB(word);
    return true;
  }
  return false;
}

function saveDB(word) {
  var letters = word.match(/[\u0b80-\u0bff][\u0bbe-\u0bcd\u0bd7]?/gi);
  if (letters.length === 4) {
    tamilWordle.updateOne(
      { _id: "62342a8019cac177b6db622d" },
      { $push: { wordslist: letters, words: word } },
      function (error, success) {
        if (error) {
          console.log("error");
        } else {
          console.log("success");
        }
      }
    );
  }
}

async function getDB() {
  var wordlist = await tamilWordle.findById("62342a8019cac177b6db622d", {
    _id: 0,
  });
  return wordlist;
}

app.get("/", function (req, res) {
  res.redirect("https://google.com");
});

app.get("/allwords", async function (req, res) {
  var words = await getDB();
  res.send(words);
  res.end();
});

app.get("/search", async function (req, res) {
  var searchWord = req.query.word;
  if (!searchWord) {
    res.send({ error: "Enter a valid word" });
    return;
  }
  var wordlist = await getDB();
  if (wordlist.words.includes(searchWord)) {
    res.send({ valid: true });
    return;
  } else {
    var internet = await fetchInternet(searchWord);
    if (internet) {
      res.send({ valid: true });
      return;
    } else {
      res.send({ valid: false });
      return;
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Started");
});
