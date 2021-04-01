require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

// Cors 
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}

app.use(express.static('public'));

//Middlewares
app.use(express.json());

app.use(cors(corsOptions));

//Template Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Routes
app.use('/api/files', require('./routes/file'));
app.use('/files', require('./routes/show'));
app.use('/files/download/', require('./routes/download'));


app.listen(PORT, console.log(`Listening on port ${PORT}.`));
