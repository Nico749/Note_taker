const express = require('express')
const path = require('path')
const fs = require('fs')
// Helper method for generating unique ids
const uid = require('./helpers/uid')

const notes=require ('./db/db.json')
const PORT = 3001;

const app = express()
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//GET request 
app.get('/notes', (req, res) => {
  //console that a get request was received  
  console.log(`New ${req.method} request received`)
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (req, res) => { 
    console.log(`New ${req.method} request received`)
    res.json(notes)
})

app.get('*', (req, res) => { 
  console.log(`New ${req.method} request received`)  
  res.sendFile(path.join(__dirname,"./public/index.html"))
})
//POST request
app.post('/api/notes', (req,res) =>{
//log that a post request was received
console.log(`New ${req.method} request received`)

const {title,text} = req.body
//check if all properties are present 
if (title&&text){
    const newNote = {
        title,
        text,
        note_id:uid(),
    }

//reading existing notes
fs.readFile("./db/db.json","utf-8",(err,data)=>{
    if (err){
        console.log(err)
    }
    else {
        const parsedNotes=JSON.parse(data)
        parsedNotes.push(newNote)

        //write the new note on the file
        fs.writeFile('./db/db.json',JSON.stringify(parsedNotes,null,4),(writeErr)=>{
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


app.delete('/api/notes/:id', (req, res) => {
  //log that a delete request was received
  var filteredNotes=[]
  console.log(`New ${req.method} request received for the id# ${req.params.id} note`)


  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      const { id } = req.params;
      //console.log(id)
      if (!id){return res.json('No notes found for this ID')}
      else{
      // Iterate through the terms name to check if it matches `req.params.id`
      for (let i = 0; i < notes.length; i++) {
        //console.log(`Note ${notes[i].note_id}`)

        //if (id === notes[i].note_id) {
          filteredNotes = notes.filter(el => el.note_id != id )
          //notes.splice(i, 1)
          //console.log(`Item number ${id} removed!`)
        
        //}
      }
      
      
      fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (writeErr) => {
        writeErr
          //log if notes were updated successfully or not 
          ? console.error(writeErr)
          : console.info('Done!')
      })

    

    
  }}})
  
  // Return a message if the note doesn't exist in our DB
  return res.json('Note successfully deleted')

})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
)
