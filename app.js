require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/database");
const app = express();
const expressLayout = require("express-ejs-layouts");
const apiRouter = require("./routes/api");
const wardRouter = require("./routes/ward");
const districtRouter = require("./routes/district");
const departmentRouter = require("./routes/department");
// const departmentRouter = require("./routes/department");
const authRouter = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const session = require("express-session");
const flash = require("connect-flash");
connectDB();

// Templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main", "layouts/department", "./layouts/auth");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET || crypto.randomBytes(20).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());
// app.use(cors(corsOptions));
// Error handler
app.use(errorHandler);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  res.render("index");
});
app.use("/api", apiRouter);
app.use("/ward", wardRouter);
app.use("/district", districtRouter);
app.use("/department", departmentRouter);
app.use("/auth", authRouter);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port", process.env.PORT || 4000);
  });
});
