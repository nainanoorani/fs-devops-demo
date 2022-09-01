//middleware-runs everytime app is used
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')


app.use(express.json())
app.use(cors())
// Added from rollbar. Include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'b44b511f11d4489686d8a135a6a098a7',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')
const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.log('Accessed HTML successfully')
    res.sendFile(path.join(__dirname, '/index.html'))
    //let us know someone is accessing our code
})

app.get('/api/students', (req, res) => {
    rollbar.info('someone got the students to pull up')
    res.status(200).send(students)
    //say you successfully got students
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           rollbar.log('student added successfully', {author:"naina",type: "manual entry" } )
           res.status(200).send(students)
       } else if (name === ''){
        rollbar.error('No name provided.')   
        res.status(400).send('You must enter a name.')
       } else {
        rollbar.error('Student already exists.')
           res.status(400).send('That student already exists.')

       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info('student got deleted')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
