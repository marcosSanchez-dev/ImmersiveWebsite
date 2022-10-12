require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");
const PrismicH = require("@prismicio/helpers");

const UAParser = require("ua-parser-js");
const { response } = require("express");

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

const HandleLinkResolver = (doc) => {
  // if (doc.type === "product") {
  //   return `/detail/${doc.uid}`;
  // }

  // if (doc.type === "collections") {
  //   return "/collections";
  // }

  // if (doc.type === "about") {
  //   return "/about";
  // }

  return "/";
};

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: HandleLinkResolver,
  };

  res.locals.PrismicH = PrismicH;
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views");

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/about", async (req, res) => {
  initApi(req).then((api) => {
    api
      .query(Prismic.Predicates.any("document.type", ["about", "meta"]))
      .then((response) => {
        const { results } = response;
        const [about, meta] = results;

        res.render("pages/about", {
          about,
          meta,
        });
      });
  });
});

app.get("/collection", (req, res) => {
  res.render("pages/collection");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
