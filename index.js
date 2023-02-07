const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
//
require("dotenv").config({ path: "./config/.env" });

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("<h1>Hellooo!</h1>");
});

app.get("/info", (req, res) => {
  return res.status(200).json({
    msg: `Phonebook has info for ${persons.length} people`,
    date: new Date(),
  });
});

app.get("/api/persons", (req, res) => {
  return res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    return res.json(person);
  }

  return res.status(404).send("no such person exists");
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name missing" });
  }
  if (!number) {
    return res.status(400).json({ error: "number missing" });
  }

  const nameFound = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );

  if (nameFound) {
    return res.status(400).json({ error: "name already in phonebook" });
  }

  const person = {
    id: generateId(),
    name,
    number,
    date: new Date(),
  };

  persons = [...persons, person];

  return res.status(200).json(person);
});

app.put("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const newPerson = req.body;

  persons = persons.map((person) => (person.id === id ? newPerson : person));

  return res.status(204).json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);

  return res.status(204).end();
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
