const express = require("express");
const app = express();
const port = 3000;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config[1].output.publicPath,
  })
);

const dbName = "blogPosts";
let db;

//var { blogPosts } = require("./database/database.js");

var fs = require("fs");

/* function saveFile(newData) {
  fs.writeFile("./database/database.json", JSON.stringify(newData), (err) => {
    if (err) throw err;
    console.log("Updated!");
  });
}
let oldblogPosts;

function getFile() {
  fs.readFile(
    "./database/database.json",
    { encoding: "utf-8" },
    (err, data) => {
      oldblogPosts = JSON.parse(data);
    }
  );
} */

/* getFile(); */

let stasis = express.static("./images");
let styles = express.static("./styles");
let script = express.static("./scripts");
let dist = express.static("./dist");

//the above code returns a function which, used in conjunction with app.use, links a directory
// on the filesystem to a url so that when the url gets called, the filepath is read

function logHel(req, res, next) {
  console.log("hel", req.path);
  next();
}

app.use(logHel);

function x(tobelogged) {
  return function y(req, res, next) {
    console.log(tobelogged, req.path);
    next();
  };
}

app.use(x("Dont go to this url: "));

app.use("/scripts", script);
app.use("/styles", styles);
app.use("/images", stasis);
app.use("/dist", dist);

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  let blogPosts;
  if (err) return console.log(err);

  // Storing a reference to the database so you can use it later
  db = client.db(dbName);
  const blogs = db.collection("blogPosts");
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);

  blogs.find({}).toArray(function (err, docs) {
    blogPosts = docs;
  });

  //fetches the blog data
  app.get("/displayBlog", (req, res) => {
    res.header("Content-Type", "text/html");
    res.send(`
            <head> <link rel="stylesheet" href="/styles/style.css"></head>
            <body></body>
            <script src = '/dist/main.js' type='module'>
            </script>
            <style src = '/styles/style.css'>
            </style>
            `);
  });
  app.get("/reactBlog", (req, res) => {
    res.send(
      `
    <head> <link rel="stylesheet" href="/styles/style.css"></head>
    <body><div id="root"></div></body>
    <script src = '/dist/main2.js' type='module'>
    </script>
    <style src = '/styles/style.css'>
    </style>
    `
    );
  });
  app.get("/api/blog/", (req, res) => {
    // let blogs = ``;
    // for (let blog of blogPosts) {
    //   blogs += `<div>Blog: ${blog.title}</div><div>By: ${blog.author}</div><div>${blog.body}</div>`;
    // }
    res.header("Content-Type", "text/html");

    res.send(JSON.stringify(blogPosts));
  });
  app.get("/blog/", (req, res) => {
    let blogs = `<head> <link rel="stylesheet" href="/styles/style.css"></head>`;
    for (let blog of blogPosts) {
      blogs += `<div class = 'title'>Blog: ${blog.title}</div><div class = 'author'>By: ${blog.author}</div><div class = 'blog'>${blog.body}</div><img src = ${blog.image}></img>`;
    }
    res.header("Content-Type", "text/html");
    res.write(blogs);
  });
  app.delete("/blog/api", (req, res) => {
    blogs
      .deleteOne({ id: req.query.del })
      .then((data) => {
        if (data) {
          console.log("THIS IS THE DATA", data);
        }
        blogs.find({}).toArray(function (err, docs) {
          console.log("the new data should look like", docs);
          blogPosts = docs;
          res.send(JSON.stringify(blogPosts));
        });
        console.log("the new data might look like", blogPosts);
      })
      .catch((err) => {
        console.log("THIS IS THE ERROR", err);
        res.status(500).send();
      });
    /* blogs.find({}).toArray(function (err, docs) {
      blogPosts = docs;
    }); */
    /* let i = 0;
    for (let blog of blogPosts) {
      if (blog.id === req.query.del) {
        console.warn("I am trying to splice at index", i);
        blogPosts.splice(i, 1);
      }
      i++;
    } */
    //saveFile(blogPosts);
    //res.send();
  });
  app.post("/blog/api/", (req, res) => {
    if (req.query.newText) {
      //blogPosts.unshift(JSON.parse(req.query.newText));
      blogs.insertMany([JSON.parse(req.query.newText)]).then(() => {
        blogs
          .find({})
          .toArray()
          .then((data) => {
            console.log("new data is", data);
            blogPosts = data;
            console.log("therefore new blogposts are", blogPosts);
            res.send(JSON.stringify(blogPosts));
          });
      });
    }
    if (req.query.name) {
      let toEdit = req.query.edit;
      let name = req.query.name;
      const filter = { id: toEdit };
      const updateDoc = {
        $set: {
          title: name,
        },
      };
      blogs.updateOne(filter, updateDoc).then(() => {
        blogs.find({}).toArray((err, docs) => {
          blogPosts = docs;
          res.send(JSON.stringify(blogPosts));
        });
      });
    }
    if (req.query.update) {
      let toEdit = req.query.edit;
      let update = req.query.update;
      const filter = { id: toEdit };
      const updateDoc = {
        $set: {
          body: update,
        },
      };
      blogs.updateOne(filter, updateDoc).then(() => {
        blogs.find({}).toArray((err, docs) => {
          blogPosts = docs;
          res.send(JSON.stringify(blogPosts));
        });
      });
    }
    if (req.query.sign) {
      let toEdit = req.query.edit;
      let sign = req.query.sign;
      const filter = { id: toEdit };
      const updateDoc = {
        $set: {
          author: sign,
        },
      };
      blogs.updateOne(filter, updateDoc).then(() => {
        blogs.find({}).toArray((err, docs) => {
          blogPosts = docs;
          res.send(JSON.stringify(blogPosts));
        });
      });
    }
  });
});

app.listen(port, () => console.log(`listening on port ${port}`));
