const express = require('express')
const path = require('path')
const fs = require('fs')
// Helper method for generating unique ids
const uid = require('./helpers/uid')

const notes = require('./db/db.json')
const PORT = process.env.PORT ||3001;

const app = express()
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//GET requests 
app.get('/notes', (req, res) => {
  //console that a get request was received  
  console.log(`New ${req.method} request received`)
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {

  const requestedId = req.params.id

  for (let i = 0; i < notes.length; i++) {
    if (requestedId === notes[i].note_id) {
      return res.json(notes[i])
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json('No match found');
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"))
})

//POST request
app.post('/api/notes', (req, res) => {
  //log that a post request was received
  console.log(`New ${req.method} request received`)

  const { title, text } = req.body
  //check if all properties are present 
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uid(),
    }

    //reading existing notes
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        const parsedNotes = JSON.parse(data)
        parsedNotes.push(newNote)

        //write the new note on the file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => {
          writeErr
            //log if notes were updated successfully or not 
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
        });
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review, missing value');
  }
});

//DELETE request 
app.delete('/api/notes/:id', (req, res) => {
  //log that a delete request was received
  var filteredNotes = []
  console.log(`New ${req.method} request received for the id# ${req.params.id} note`)


  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      const { id } = req.params;
      // Iterate through the terms name to check if it matches `req.params.id`
      for (let i = 0; i < notes.length; i++) {
        if (id === notes[i].note_id) {

          //create a new array of filtered notes without the one that has the same id we insert
          filteredNotes = notes.filter(el => el.note_id != id)

          fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (writeErr) => {
            writeErr
              //log if notes were updated successfully or not 
              ? console.error(writeErr)
              : console.info('Done!')
          })
          return res.json(`Note ${id} deleted`)
        }
      }
      return res.json('No match found');

    }
  })

})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
)
