require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const ejsMate = require('ejs-mate');
const homeRouter = require('./routes/home');
const officerRouter = require('./routes/officer');
const apiRouter = require("./routes/api");
const errorHandler = require('./middleware/errorHandler');
const authentication = require('./middleware/authentication'); 
const cookieParser = require('cookie-parser');
connectDB();

app.engine('ejs', ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors(corsOptions));
// Error handler
app.use(errorHandler)
app.use(authentication)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/', homeRouter);
app.use('/api', apiRouter);
app.use('/officer', officerRouter);

mongoose.connection.once('open', () => {
  console.log("Connected to DB")
  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port', process.env.PORT || 4000);
  });
})
