const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const homeRoutes = require("./routes/home");
const officer = require("./routes/officer");

app.engine("ejs", ejsMate);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use("/", homeRoutes);
app.use("/officer", officer);

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port", process.env.PORT || 5000);
});
