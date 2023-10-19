const express = require("express");
const app = express();
const homeRoutes = require("./routes/home");
const officer = require("./routes/officer");

app.set("view engine", "ejs");

app.use("/", homeRoutes);
app.use("/officer", officer);

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port", process.env.PORT || 5000);
});
