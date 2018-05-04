const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const static = express.static(__dirname + "/public");
const connection = require("./config/mongoConnection");


const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const main = async () => {
  const db = await connection();
  //await db.serverConfig.close();
};

main().catch(error => {
  console.log(error);
});


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");

  if (process && process.send) process.send({done: true});
});
