const express = require("express");
//
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
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hellooo!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send("no such person exists");
  }
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const { content, important } = req.body;

  if (!content) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = {
    id: generateId(),
    content,
    important: important || false,
    date: new Date(),
  };

  persons = [...persons, person];

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
