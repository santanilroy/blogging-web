import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import {fileURLToPath} from "url";
import { dirname } from "path";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(methodOverride("_method"));
const _dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true}));

const posts = [];


app.get("/", (req, res) => {
  res.render("welcome.ejs");
});

app.get("/home", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/new-posts", (req, res) => {
  res.render("createpost.ejs");
});

app.get("/post",  (req, res) => {
  res.render("createpost.ejs");
})

app.post("/create-post", (req, res) => {
let titles = req.body.title;
let authors = req.body.author;
let contents = req.body.content;

const newpost = {
  id: posts.length + 1,
  titles,
  authors,
  contents,
  date: new Date().toLocaleDateString(),
  excerpt: contents.substring(0, 100) + '....',
}

posts.push(newpost);
res.redirect("/home");
});

app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);

  const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts.splice(index, 1); 
    res.redirect("/home");
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});