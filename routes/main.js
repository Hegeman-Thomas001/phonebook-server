const express = require("express");
const router = express.Router();
//
const { createPerson } = require("../controllers/persons");

router.post("/persons", createPerson);

module.exports = router;
