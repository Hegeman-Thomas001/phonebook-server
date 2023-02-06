const express = require("express");
const morgan = require("morgan");
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
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hellooo!</h1>");
});

app.get("/info", (req, res) => {
  res.status(200).json({
    msg: `Phonebook has info for ${persons.length} people`,
    date: new Date(),
  });
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

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
