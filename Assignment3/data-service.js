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

var express = require("express");
var app = express();
var path = require("path");
const fs = require("fs");

var employees = [];
var departments = [];
var managers = [];


module.exports.initialize = function () {
    return new Promise(function(resolve, reject) {
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read employees.");
//                throw err;  // don't know if we need this for this lab
            }
            else {
                employees = JSON.parse(data);

                fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                    if (err) {
                        reject("Unable to read departments.");
        //                throw err;
                    }
                    else {   
                        departments = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });        
}

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject){
        if(employees.length == 0)
            reject("No results for employees returned.");
        else 
            resolve(employees);
    })
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject){
        if (departments.length == 0) 
            reject("No results for departments returned.");
        else 
            resolve(departments);
    })
}

module.exports.getManagers = function() {
    return new Promise(function(resolve, reject){       
        let j = 0;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers[j++] = employees[i];
            }
        }
    if (managers.length == 0)
        reject("No results returned."); 
    else 
        resolve(managers);    
    })
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function(resolve, reject){
        if(employees.length == 0) {
            console.log("dead");
            reject("No results!!");
        } 
        else {
            if (employeeData.isManager == undefined) {
                employeeData.isManager = false;
            }
            employeeData.employeeNum = employees.length+1;
            employees.push(employeeData);
            resolve();
        }
    })
}

module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function(resolve, reject){
        if (status){       
            let j = 0;
            var emps = [];

            for (let i = 0; i < employees.length; i++) {
                if (employees[i].status.toLowerCase() == status.toLowerCase()) {
                    emps[j++] = employees[i];
                }
            }
            if (emps.length == 0) 
                reject("Status Invalid");
            else
                resolve(emps);
        }
        else 
            resolve(employees);
    })
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function(resolve, reject){
        if (department) {
            let j = 0;
            var depts = [];

            for (let i = 0; i < employees.length; ++i) {
                if (employees[i].department == department) {
                    depts[j++] = employees[i];
                }
            }
            if (depts.length == 0)
                reject("Department Invalid");
            else 
                resolve(depts);
        }
        else 
            resolve(employees);
    })
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function(resolve, reject) {
        if (manager) {
            let j = 0;
            var mans = [];

            for (let i = 0; i < employees.length; ++i) {
                if (employees[i].employeeManagerNum == manager) {
                    mans[j++] = employees[i];
                }
            }
            if (mans.length == 0) 
                reject("Manager Number Invalid");
            else 
                resolve(mans);
        }
        else 
            resolve(employees);
    })
}

module.exports.getEmployeeByNum = function(empnum) {
    return new Promise(function(resolve, reject) {
        let b = 0;
        for (let i = 0; i < employees.length; ++i) {
            if (employees[i].employeeNum == empnum) {
                b++;
                resolve(employees[i]); 
            }
        }
        if (b == 0)
            reject("No matching Employee Number");
    })
}
