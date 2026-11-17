require('dotenv').config()                           // loads server/.env into process.env
const express = require('express')                   // the web framework
const cors = require('cors')                         // controls which sites may call the API
const completionsRouter = require('./routes/completions')  // Import the router for reading and saving course completions.



const app = express()                                // creates the app

app.use(cors({ origin: process.env.CLIENT_ORIGIN })) // only your React app (port 5173) may call this API
app.use(express.json())                              // lets req.body work for JSON requests

app.use('/api/courses', require('./routes/courses')) // sends /api/courses/... requests to routes/courses.js
app.use('/api/completions', completionsRouter)

app.listen(process.env.PORT, () => {                 // starts the server; this keeps the program running
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})