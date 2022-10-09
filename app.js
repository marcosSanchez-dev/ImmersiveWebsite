const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/collection", (req, res) => {
  res.render("pages/collection");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
