/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sue Ming Chun Student ID: 032343154 Date: Wednesday, October 17, 2018
*
* Online (Heroku) Link: https://secure-reaches-12278.herokuapp.com/
*
********************************************************************************/

const express = require("express");
var app = express();
const path = require("path");
const dataService = require("./data-service.js");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

var HTTP_PORT = process.env.PORT || 8080;

dataService.initialize();

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({storage: storage});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
// use this one line if code breaks down the road 

app.get("/employees", function(req,res){
    dataService.getAllEmployees().then(function(all){ 
        if (req.query.status) {
            dataService.getEmployeesByStatus(req.query.status).then(function(emp){
                res.json(emp);
            }).catch((statErr) => {
                res.json({message: statErr}) 
            });
        } // close status if 
        else if (req.query.department) {
            dataService.getEmployeesByDepartment(req.query.department).then(function(dept){
                res.json(dept);
            }).catch((deptErr) => {
                res.json({message: deptErr}) 
            });
        } // close department if 
        else if (req.query.manager) {
            dataService.getEmployeesByManager(req.query.manager).then(function(man){
                res.json(man);
            }).catch((manErr) => {
                console.log("is fucked");
                res.json({message: manErr}) 
            });
        } // close manager if 
        else 
            res.json(all);
    }).catch((allErr) => { // using .catch to res.json the reject 
        res.json({message: allErr}) // send error message (from function's reject)
    })
});

app.get("/employee/:value", function(req, res) {
    dataService.getEmployeeByNum(req.params.value).then(function(empnum) {
        res.json(empnum);
    }).catch((numErr) => {
        res.json({message: numErr}) 
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

app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname,"views/addEmployee.html"))
});

app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"views/addImage.html"))
});

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/images", function(req, res) {  
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), function(err, items) {
        res.json({images:items});
        }
    )
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.post("/employees/add", upload.array(), function(req,res, next){
    dataService.addEmployee(req.body).then(function() {
        res.redirect("/employees");
        console.log("is good");
    }).catch(function(addErr) {
        res.json({message: addErr}) 
    });
});

// setup http server to listen on HTTP_PORT
dataService.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(){
    console.log("Unable to open file.");
});