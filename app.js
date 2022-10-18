require("dotenv").config();

const logger = require("morgan");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());

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
  console.log(doc);
  if (doc.type == "product") {
    return `/detail/${doc.slug}`;
  }

  if (doc.type == "about") {
    return "/about";
  }
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
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: HandleLinkResolver,
  // };

  res.locals.Link = HandleLinkResolver;

  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views");

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const home = await api.getSingle("home");
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");

  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    { fetchLinks: "product.image" }
  );

  res.render("pages/home", {
    collections,
    home,
    meta,
    preloader,
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);
  const about = await api.getSingle("about");
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");

  // console.log("preloader: ", preloader);

  res.render("pages/about", {
    about,
    meta,
    preloader,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const meta = await api.getSingle("meta");
  const home = await api.getSingle("home");
  const preloader = await api.getSingle("preloader");

  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    { fetchLinks: "product.image" }
  );

  res.render("pages/collections", {
    collections,
    home,
    meta,
    preloader,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");

  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  res.render("pages/detail", {
    meta,
    product,
    preloader,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
