require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const ejsMate = require('ejs-mate');
const homeRouter = require('./routes/home');
const officerRouter = require('./routes/officer');
const apiRouter = require("./routes/api");
connectDB();
app.engine('ejs', ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));
// app.use('/', homeRouter);
app.use('/api', apiRouter);
app.use('/officer', officerRouter);

mongoose.connection.once('open', () => {
  console.log("Connected to DB")
  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port', process.env.PORT || 4000);
  });
})
