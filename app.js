require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const ejsMate = require('ejs-mate');
const apiRouter = require("./routes/api");
const wardRouter = require("./routes/ward");
const districtRouter = require("./routes/district");
const departmentRouter = require('./routes/department');
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

app.get('/', async (req, res) => {
  res.render('index');
});
app.use('/api', apiRouter);
app.use('/ward', wardRouter);
app.use('/district', districtRouter);
app.use('/department', departmentRouter);

mongoose.connection.once('open', () => {
  console.log("Connected to DB")
  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port', process.env.PORT || 4000);
  });
})
