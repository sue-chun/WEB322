const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        dateTime: Date,
        userAgent: String
    }]
})

let User; 

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://smchun:q7ajvw@ds031098.mlab.com:31098/web322_a6");

        db.on('error', (err)=>{ reject(err); });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password == userData.password2) {
            bcrypt.genSalt(10, function(err, salt) { 
                bcrypt.hash(userData.password, salt, function(err, hash) { 
                    if (!err) {
                        userData.password = hash;
                        let newUser = new User(userData);
                        newUser.save((err) => {
                            if(err && err.code == 11000) {
                                reject("Username already taken.");
                            } else if (err && err.code != 11000) {
                                reject("There was an error creating the user: " + err);
                            }
                            else if (!err) {
                                resolve();
                            }
                        });
                    }
                    else 
                        reject("There was an error encrypting the password.");
                });
            });
        }
        else 
            reject("Passwords do not match.");
    });
};

module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName })
        .exec()
        .then((users) => {
            if (users.length == 0) {
                reject("Unable to find user: " + userData.userName);
            }
            bcrypt.compare(userData.password, users[0].password).then((res) => {
                if (res) {
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.update({ userName: users[0].userName},
                        { $set: { loginHistory : users[0].loginHistory } },
                        { multi: false })
                    .exec()
                    .then(()=>{
                        resolve(users[0]);
                    })
                    .catch((err)=>{
                        reject("There was an error verifying the user: " + err);
                    })
                }
                else {
                    reject("Passwords do not match.");
                }
            // no catch for bcrypt 
        }).catch(() => {
            reject("Unable to find user: " + userData.userName);
        });
    });    
});
}