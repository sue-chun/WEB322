/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sue Ming Chun Student ID: 032343154 Date: Wednesday, October 3, 2018
*
* Online (Heroku) Link: https://secure-reaches-12278.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/employees", function(req,res){
    dataService.getAllEmployees().then(function(employees){ // using .then to res.json the data
        res.json(employees); // sends string version to website
    }).catch((empError) => { // using .catch to res.json the reject 
        res.json({message: empError}) // send error message (from function's reject)
    })
});

app.get("/departments", function(req,res){
    dataService.getDepartments().then(function(departments){
        res.json(departments); 
    }).catch((deptError) => {
        res.json({message: deptError}) 
    })
});

app.get("/managers", function(req,res){
    dataService.getManagers().then(function(managers){
        res.json(managers); 
    }).catch((manError) => {
        res.json({message: manError})
    })
});

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

  app.use(function(req,res){ // * needs to be on bottom apparently 
    res.status(404).send("Page Not Found");
  });

// setup http server to listen on HTTP_PORT
dataService.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(){
    console.log("Unable to open file.");
});