/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sue Ming Chun Student ID: 032343154 Date: Monday, November 19, 2018
*
* Online (Heroku) Link: https://mysterious-savannah-46970.herokuapp.com/
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
                if (emp.length > 0) 
                    res.render("employees", {employees: emp});
                else
                    res.render("employees",{ message: "No employees to show." });
            }).catch((statErr) => {
                res.render("employees", {message: statErr}); 
            });
        } // close status if 
        else if (req.query.department) {
            dataService.getEmployeesByDepartment(req.query.department).then(function(dept){
                if (dept.length > 0)                 
                    res.render("employees", {employees: dept});
                else 
                    res.render("employees",{ message: "No employees to show." });
            }).catch((deptErr) => {
                res.render("employees", {message: deptErr}); 
            });
        } // close department if 
        else if (req.query.manager) {
            dataService.getEmployeesByManager(req.query.manager).then(function(man){
                if (man.length > 0)                 
                    res.render("employees", {employees: man});
                else 
                    res.render("employees",{ message: "No employees to show." });            }).catch((manErr) => {
            }).catch((manErr) => {
                res.render("employees", {message: manErr}) 
            });;
        } // close manager if 
        else {
            if (all.length > 0)                 
                res.render("employees", {employees: all});
            else 
                res.render("employees",{ message: "No employees to show." });
        }
    }).catch(() => {
        res.status(404).send("No employees to show.");    
    })
});

/*
app.get("/employee/:value", function(req, res) {
    dataService.getEmployeeByNum(req.params.value).then(function(empnum) {
        res.render("employee", {employee: empnum});
    }).catch((numErr) => {
        res.render("employee", {message: numErr}) 
    })
});

*/
app.get("/employee/:empNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
viewData.employee = data; //store employee data in the "viewData" object as "employee"
console.log(viewData.employee.firstName);
        } else {
viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
viewData.employee = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
.then((data) => {
viewData.departments = data; // store department data in the "viewData" object as "departments"

        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object

        for (let i = 0; i<viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
viewData.departments[i].selected = true;
            }
        }

    }).catch(() => {
viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
res.status(404).send("Employee Not Found");
        } else {
res.render("employee.hbs", { viewData: viewData }); // render the "employee" view
        }
    });
});

app.get("/department/:value", function(req, res) {
    dataService.getDepartmentById(req.params.value).then(function(deptnum) {
        res.render("departments", {department: deptnum});
        if (deptnum.length == 0) 
            res.status(404).send("Department Not Found");
    }).catch(() => {
        res.status(404).send("Department Not Found");    
    })
});

app.get("/departments/delete/:value", function(req, res) {
    dataService.deleteDepartmentById(req.params.value).then(function(){
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Remove Department / Department not found");    
    })
});

app.get("/employees/delete/:value", function(req, res) {
    dataService.deleteEmployeeByNum(req.params.value).then(function(){
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found");    
    })
});

app.get("/departments", function(req,res){
    dataService.getDepartments().then(function(depts){
        if (depts.length > 0)                 
            res.render("departments", {department: depts});
        else 
            res.render("departments",{ message: "No departments to show." });
    }).catch(() => {
        res.status(500).send("Unable to load departments.");    
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

app.get("/images/add", function(req,res){
    res.render(path.join(__dirname,"views/addImage.hbs"))
});

app.get("/employees/add", function(req,res){
    dataService.getDepartments().then(function(data) {
        res.render(path.join(__dirname,"views/addEmployee.hbs"), {department: data});
    }).catch(function() {
        res.render("addEmployee", {departments: []});
    })
});

app.get("/departments/add", function(req, res) {
    res.render(path.join(__dirname,"views/addDepartment.hbs"))
})

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
    }).catch(function(addErr) {
        res.json({message: addErr}) 
    });
});

app.post("/departments/add", upload.array(), function(req,res, next){
    dataService.addDepartment(req.body).then(function() {
        res.redirect("/departments");
    }).catch(function(addErr) {
        res.json({message: addErr}) 
    });
});

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(function() {
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
    });
});

app.post("/departments/update", (req, res) => {
    dataService.updateDepartment(req.body).then(function() {
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Department");
    });
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