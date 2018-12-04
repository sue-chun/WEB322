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
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read departments.");
    //                throw err;
                }
                departments = JSON.parse(data);
            });
            resolve();
        });
    });        
}

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject){
        if(employees.length == 0)
            reject("No results for employees returned.");
        resolve(employees);
    })
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject){
        if (departments.length == 0) 
            reject("No results for departments returned.");
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
    resolve(managers);    
    })
}
