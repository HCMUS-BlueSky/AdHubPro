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
const authRouter = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const authentication = require("./middleware/authentication");
const cookieParser = require("cookie-parser");
connectDB();

// Templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main", "./layouts/auth");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors(corsOptions));
// Error handler
app.use(errorHandler);
app.use(authentication);

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  res.render("index");
});
app.use("/api", apiRouter);
app.use("/ward", wardRouter);
app.use("/district", districtRouter);
app.use("/department", departmentRouter);
app.use("/account", authRouter);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port", process.env.PORT || 4000);
  });
});
