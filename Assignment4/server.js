/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sue Ming Chun Student ID: 032343154 Date: Monday, November 6, 2018
*
* Online (Heroku) Link: https://radiant-ocean-52723.herokuapp.com/
*
********************************************************************************/

const express = require("express");
var app = express();
const path = require("path");
const dataService = require("./data-service.js");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars"); 


var HTTP_PORT = process.env.PORT || 8080;

dataService.initialize();

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }  ,
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }      
    } 
}));
app.set('view engine', '.hbs');

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

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/employees", function(req,res){
    dataService.getAllEmployees().then(function(all){ 
        if (req.query.status) {
            dataService.getEmployeesByStatus(req.query.status).then(function(emp){
                res.render("employees", {employees: emp});
            }).catch((statErr) => {
                res.render("employees", {message: statErr}); 
            });
        } // close status if 
        else if (req.query.department) {
            dataService.getEmployeesByDepartment(req.query.department).then(function(dept){
                res.render("employees", {employees: dept});
            }).catch((deptErr) => {
                res.render("employees", {message: deptErr}); 
            });
        } // close department if 
        else if (req.query.manager) {
            dataService.getEmployeesByManager(req.query.manager).then(function(man){
                res.render("employees", {employees: man});
            }).catch((manErr) => {
                res.render("employees", {message: manErr}) 
            });
        } // close manager if 
        else 
            res.render("employees", {employees: all});
    }).catch((allErr) => { // using .catch to res.json the reject 
        res.json("employees", {message: allErr}) // send error message (from function's reject)
    })
});

app.get("/employee/:value", function(req, res) {
    dataService.getEmployeeByNum(req.params.value).then(function(empnum) {
        res.render("employee", {employee: empnum});
    }).catch((numErr) => {
        res.render("employee", {message: numErr}) 
    })
});

app.get("/departments", function(req,res){
    dataService.getDepartments().then(function(depts){
        res.render("departments", {departments: depts}); 
    }).catch((deptError) => {
        res.render("departments", {message: deptError}) 
    })
});

/* app.get("/managers", function(req,res){
    dataService.getManagers().then(function(managers){
        res.json(managers); 
    }).catch((manError) => {
        res.json({message: manError})
    })
}); 
*/

app.get("/employees/add", function(req,res){
    res.render(path.join(__dirname,"views/addEmployee.hbs"))
});

app.get("/images/add", function(req,res){
    res.render(path.join(__dirname,"views/addImage.hbs"))
});

app.get("/", function(req,res){
    res.render(path.join(__dirname,"/views/home.hbs"));
  });

app.get("/about", function(req,res){
    res.render(path.join(__dirname,"/views/about.hbs"));
});

app.get("/images", function(req, res) {  
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), function(err, items) {
        res.render("images", {items: items});
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

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(function() {
        res.redirect("/employees");
    }).catch(function(updateErr) {
        res.json({message: updateErr})
    })
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