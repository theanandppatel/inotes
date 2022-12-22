const express = require('express')
var cors = require('cors')
var app = express();
const mongoose = require('mongoose')

require("dotenv").config({ path: './config.env' });

app.use(cors())

const connect_string = process.env.DATABASE_URI

mongoose.connect(connect_string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("Database connected!"))
        .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/',(req,res)=>{
  res.send("This is the backend server of iNotes website")
})

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`)
})