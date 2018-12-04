
const Sequelize = require('sequelize');

var sequelize = new Sequelize('db723n5mijj0i3', 'gpjxsvvfwnjnkl', 'f66fb7287938b913daac5e5fee3c50b12d9d3faa20e2d1eff72574a74f2f1ab4', {
    host: 'ec2-184-72-221-2.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
dialectOptions: {
ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            resolve();
        }).catch(function () {
            reject("Unable to sync database.");
        });
    });     
}

module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            Employee.findAll({
                order: ['employeeNum']
            }).then(function(Employee){
                resolve(Employee);
            }).catch(function () {
                reject("No employee results returned.");
            });
        });
    });        
}

module.exports.getDepartments = function() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            Department.findAll({
                order: ['departmentId']
            }).then(function(Department){
                resolve(Department);
            }).catch(function () {
                reject("No department results returned.");
            });
        });
    }); 
}

module.exports.getManagers = function() {
    return new Promise(function (resolve, reject) {
        reject();
        });
}

module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            if (status) {
                Employee.findAll({ 
                    order: ['employeeNum'],
                    where: {
                        status: status
                    }
                }).then(function(data){
                    resolve(data);
                }).catch(function() {
                    reject("No results returned.");
                })
            }
            else 
                reject("Employee status not valid.");
        });
    });
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            if (department) {
                Employee.findAll({ 
                    order: ['employeeNum'],
                    where: {
                        department: department
                    }
                }).then(function(data){
                    resolve(data);
                }).catch(function() {
                    reject("No results returned.");
                })
            }
        else 
            reject("Department ID not valid.");
        });
    });   
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            if (manager) {
                Name.findAll({ 
                    order: ['employeeNum'],
                    where: {
                        employeeManagerNum: manager
                    }
                }).then(function(data){
                    resolve(data);
                }).catch(function() {
                    reject("No results returned.");
                })
            }
        else 
            reject("Employee Manager Number not valid.");
        });
    });    
}

module.exports.getEmployeeByNum = function(empnum) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            if (empnum) {
                Employee.findAll({ 
                    order: ['employeeNum'],  
                    where: {
                        employeeNum: empnum
                    }
                }).then(function(data){
                    resolve(data[0]);
                }).catch(function() {
                    reject("No employee results returned.");
                })
            }
            else 
                reject("Employee Number not valid.");
        });
    });  
}

module.exports.getDepartmentById = function(id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            if (id) {
                Department.findAll({ 
                    order: ['departmentId'],
                    where: {
                        departmentId: id
                    }
                }).then(function(data){
                    resolve(data);
                }).catch(function() {
                    reject("No department results returned.");
                })
            }
        else 
            reject("Department ID not valid.");
        });
    }); 
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            employeeData.isManager = (employeeData.isManager) ? true : false;
        
            for (i in employeeData) {
                if (employeeData[i] == "")
                    employeeData[i] = null;
            } 

            Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                hireDate: employeeData.hireDate, 
                department: employeeData.department
            }).then(function(){
                resolve(Employee);
            }).catch(function() {
                reject("Unable to create employee.");
            });
        });
    });
}

module.exports.addDepartment = function(deptData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            for (i in deptData) {
                if (deptData[i] == "")
                    deptData[i] = null;
            } 
            Department.create({
                departmentId: deptData.departmentId,
                departmentName: deptData.departmentName
            })
        }).then(function() {
            resolve();
        }).catch(function () {
            reject("Unable to create department.");
        })
    });
}

module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            employeeData.isManager = (employeeData.isManager) ? true : false;
    
            for (i in employeeData) {
                if (employeeData[i] == "")
                    employeeData[i] = null;
            } 

            Employee.update({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                hireDate: employeeData.hireDate,
                department: employeeData.department
                }, 
                { where: {employeeNum: employeeData.employeeNum}}
            )
        }).then (function() {
            resolve();
        }).catch (function() {
            reject("Unable to update employee.");
        }); // close sync
    });
} 

module.exports.updateDepartment = function(deptData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            for (i in deptData) {
                if (deptData[i] == "")
                    deptData[i] = null;
            } 
            Department.update({
                departmentId: deptData.departmentId,
                departmentName: deptData.departmentName
                },
                { where: {departmentId: deptData.departmentId}}
            )
        }).then(function() {
            resolve();
        }).catch(function () {
            reject("Unable to update department.");
        })      
    });
}

module.exports.deleteDepartmentById = function(id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            Department.destroy({
                where: { departmentId: id } 
            })
        }).then(function () { 
            resolve();
        }).catch(function () {
            reject("Unable to delete department.");
        });
    });
}

module.exports.deleteEmployeeByNum = function(empnum) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            Employee.destroy({
                where: { employeeNum: empnum } 
            })
        }).then(function () { 
            resolve();
        }).catch(function () {
            reject("Unable to delete employee.");
        });
    });
}
