const Person = require("../models/Person");
//
module.exports = {
  createPerson: async (req, res) => {
    const { name, number } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name missing" });
    }
    if (!number) {
      return res.status(400).json({ error: "number missing" });
    }

    // replace with database check
    try {
      const nameFound = await Person.find({ name });

      if (nameFound) {
        return res.status(400).json({ error: "name already in phonebook" });
      }

      // replace with database creation and data from database
      const person = {
        id: generateId(),
        name,
        number,
        date: new Date(),
      };

      return res.status(200).json(person);
    } catch (error) {
      return res.status(404).json({ msg: "unable to create person", error });
    }
  },
};
