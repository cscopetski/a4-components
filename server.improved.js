const express = require("express");
const path = require("path");

let idCounter = 0;

const appdata = [];

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(express.json());
app.use(express.text());

const logger = (req, res, next) => {
  console.log("url:", req.url);
  next();
};

app.use(logger);

app.get("/get-food", (req, res) => {
  res.json(appdata);
});

app.post("/submit", (req, res) => {
  const json = JSON.parse(req.body);
  console.log(req.body);
  json.priceperpound =
    json.foodweight === 0 ? 0 : json.foodprice / json.foodweight;
  json.id = idCounter;
  idCounter++;

  appdata.push(json);
  console.log(appdata);
  res.json(appdata);
});

// app.post("/edit", (req, res) => {
//   const json = JSON.parse(req.body);
//   json.priceperpound =
//     json.foodweight === 0 ? 0 : json.foodprice / json.foodweight;
//   const index = appdata.findIndex((food) => food.id === json.id);
//   if (index !== -1) {
//     appdata[index] = json;
//   }
//   res.send(appdata);
// });

app.post("/delete", (req, res) => {
  const id = JSON.parse(req.body);

  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i].id === parseInt(id)) {
      appdata.splice(i, 1);
    }
  }

  res.send(appdata);
});
app.listen(process.env.PORT || 3000);
