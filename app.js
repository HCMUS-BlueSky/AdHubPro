require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const cors = require('cors');
const expressLayout = require('express-ejs-layouts');
const apiRouter = require('./routes/api');
const utilsRouter = require('./routes/utils');
const wardRouter = require('./routes/ward');
const districtRouter = require('./routes/district');
const departmentRouter = require('./routes/department');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const session = require('cookie-session');
const flash = require('connect-flash');
const corsOptions = require('./config/cors');

connectDB();

// Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main', 'layouts/department', './layouts/auth');
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET || crypto.randomBytes(20).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
  })
);
app.use(flash());
// app.use(cors(corsOptions));
// Error handler
app.use(errorHandler);

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(__dirname + '/public'));

// app.get("/", async (req, res) => {
//   res.render("index", { layout: false });
// });
app.get('/', (req, res) => {
  return res.redirect('/auth');
});
app.use('/api', apiRouter);
app.use('/utils', utilsRouter);
app.use('/ward', wardRouter);
app.use('/district', districtRouter);
app.use('/department', departmentRouter);
app.use('/auth', authRouter);

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port', process.env.PORT || 4000);
  });
});
