const router = require('express').Router()
const path = require ('path')

//GET requests 
router.get('/notes', (req, res) => {
  //console that a get request was received  
  console.log(`New ${req.method} request received`)
  res.sendFile(path.join(__dirname, '../public/notes.html'))
})


router.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"))
    })

module.exports = router