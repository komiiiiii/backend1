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

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
