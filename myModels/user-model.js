const fs = require('fs');
const path = require('path');

let users = [];

class user {
     constructor(email, firstName, lastName, password) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    static addUser =(email, firstName, lastName, password)=>{
        users.push(new user(email, firstName, lastName, password))
    };

    static findUser =(email)=>{
        console.log(email);
        console.log("findUser", users.some(function(user) {
            return user.email === email.toLowerCase();})
        );

        return users.some(function(user) {
            return user.email === email.toLowerCase();
        });
    };

    static selector=(email, password)=>{
        console.log("selector", users.some(function(user) {
            return user.email === email.toLowerCase() && user.password === password;
            }) );

        return users.some(function(user) {
            return user.email === email.toLowerCase() && user.password === password;
            });
    };

};

module.exports.addUser =user.addUser;
module.exports.selector =user.selector;
module.exports.findUser =user.findUser;