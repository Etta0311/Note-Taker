const server = require('express').Router();
const uuid = require('../helpers/uuid');
const {
  readFromFile, readAndAppend, writeToFile,
} = require('../helpers/fsUtils');

//GET data from db.json
server.get("/", (req, res) => {
    console.info(`${req.method} request received for notes`);

    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

server.post('/', (req, res) => {
  console.log(req.body);
  
  const { title, text } = req.body;
    if (req.body) {
      const newNotesaved = {
        title,
        text,
        id: uuid(),
      };
  
    readAndAppend(newNotesaved , './db/tips.json');

    res.json(`Note saved successfully 🚀`);
  } else {
      res.error('Error in saving this note.');
  }
});

// GET Route for a previous saved note
server.get('/:id', (req, res) => {
  const notesId = req.params.id;

  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
 
    .then((json) => {
      const result = json.filter((notes) => notes.id === notesId);
        return result.length > 0
          ? res.json(result)
          : res.json('No corresponding note saved.');
  });
});

//DELETE Route on user request
server.delete('/:id', (req, res) => {
  const notesId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
// Make a new array of all notes except the one with the ID provided in the URL
  const result = json.filter((notes) => notes.id !== notesId);
  
  // Save that array to the filesystem
  writeToFile('./db/db.json', result);
  
// Respond to the DELETE request
  res.json(`Item ${notesId} has been deleted 🗑️`);
  });
});

module.exports = server;