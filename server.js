const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const dataFile = path.join(__dirname, "data.json");

// read data
function readData() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// demo route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// GET /movies
app.get("/movies", (req, res) => {
  const data = readData();
  res.json(data.movies);
});

app.post("/movies", (req, res) => {
  const data = readData();

  const newMovie = {
    id: data.movies.length + 1,
    name: req.body.name
  };

  data.movies.push(newMovie);

  fs.writeFileSync(
    path.join(__dirname, "data.json"),
    JSON.stringify(data, null, 2)
  );

  res.status(201).json(newMovie);
});

app.put("/movies/:id", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const data = readData();
  const movieId = parseInt(req.params.id);

  const movie = data.movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movie.name = name;

  fs.writeFileSync(
    path.join(__dirname, "data.json"),
    JSON.stringify(data, null, 2)
  );

  res.json(movie);
});

app.delete("/movies/:id", (req, res) => {
  const data = readData();
  const movieId = parseInt(req.params.id);

  const index = data.movies.findIndex(m => m.id === movieId);

  if (index === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  data.movies.splice(index, 1);

  fs.writeFileSync(
    path.join(__dirname, "data.json"),
    JSON.stringify(data, null, 2)
  );

  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
