const express = require('express');
const path = require("path");
const app = express();
const socketio = require('socket.io');
const sheetsu = require('sheetsu-node');
const router = express.Router();

app.set("view engine", "pug");
console.log(path.join(__dirname, "../Client"))
app.set("views", path.join(__dirname, "../Client"));
app.use("/static", express.static(path.join(__dirname, "../Client")))

let sheetsu_result
let sheetsu_codes

var client = sheetsu({address: "https://sheetsu.com/apis/v1.0su/9c005a656f65"});


// Read whole spreadsheet
client.read().then(function(result) {
    sheetsu_result = result
    console.log("Retrieved First Data Set")
},
function (error){
    console.log(error);
})

// Read whole spreadsheet
client.read({sheet: "Sheet2"}).then(function(result) {
    sheetsu_codes = result
    console.log("Retrieved Second Data Set")
},
function (error){
    console.log(error);
})

router.get("/", (request, response) => {
    response.render("main_page", {data: sheetsu_result, codes: sheetsu_codes});
});

app.get("/get_character_data", (request, response) => {
    response.send(sheetsu_result, sheetsu_codes)
})

app.use("/", router);

const expressServer = app.listen(12345);

console.log("Listening on Port 12345")
const io = socketio(expressServer);