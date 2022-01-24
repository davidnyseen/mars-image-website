
var express = require('express');
const userHendler = require('../myModels/user-model.js');
const Cookies = require("cookies");
const { redirect } = require('express/lib/response');
const {json} = require("express");
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const db = require('../models');

exports.mainRouter = function (req, res, next) {
    if(req.session.loggedin)
        res.redirect('/access-mars');
    else
        res.redirect('/logIn');
};

exports.reRoutLogged = function (req, res, next) {
    if(req.session.loggedin)
        res.redirect('/access-mars');
    else
        next();
};

exports.register = function (req, res, next) {
    res.render('register', { massage: "" });
};

exports.logIn = function (req, res, next) {
    res.render('logIn', { massage: "" });
};

exports.emailAvailable = function (req, res, next) {
    const cookies = new Cookies(req, res, { keys: ['keybord key'] });
    cookies.set('nameRegister', new Date().toISOString(),
        { signed: true, maxAge: 60*1000 });
    return db.User.findOne({where: {email: req.body.email.trim()}})
        .then((result) => {
            if(result != null){
                res.send(false);
            }
            else{
                res.send(true);
            }
        })
        .catch((err) => {
            console.log('There was an error querying user availability', JSON.stringify(err))
            return res.status(400).send(err);
        });
    /*if (userHendler.findUser(req.body.email))
        return res.send(false);
    else
        return res.send(true);*/
};

exports.goToSetPass = function (req, res, next) {
    res.render('setPassword', {firstName:req.body.firstName.trim(), lastName:req.body.lastName.trim(), email:req.body.email.trim()});
};

/**
 *
 * @param user
 */
function newUserValidate(user){
    console.log("newUserValidate");
    return validations.passwordRules(user.password.trim())&&
        validations.notEmpty(user.firstName) && validations.notEmpty(user.lastName)
        && validations.notEmpty(user.email);
}

exports.confirmNewUser = function (req, res, next) {
    const cookies = new Cookies(req, res, { keys: ['keybord key'] });
    let lastVisit = cookies.get('nameRegister', { signed: true });
    if(!lastVisit) {
       /* const cookies = new Cookies(req, res, { keys: ['keybord key'] , HttpOnly:false });
        cookies.set('afterTimeOut', 'ggg', new Date().toISOString(),
            { signed: true, HttpOnly: false  ,maxAge: 60*1000 });*/
        return res.status(405).send({massage:"The time limit was passed"});
    }
    if(!(newUserValidate(req.body)))
        return res.status(400).send("error validate a user");
    //userHendler.addUser(req.body.email, req.body.firstName, req.body.lastName, req.body.password);
    return db.User.findOne({where: {email: req.body.email.trim()}})
        .then((result) => {
            if(result != null){
                return res.status(400).send("error creating a user");
            }
        db.User.create( {firstName:req.body.firstName.trim(), lastName:req.body.lastName.trim(),email:req.body.email.trim(),password:req.body.password.trim()} )
        .then((user) => res.send(true))
        })
        .catch((err) => {
            console.log('*** error creating a user', JSON.stringify(err))
            return res.status(400).send("error creating a user")
        })
};

exports.accountAccess = function (req, res, next) {
    console.log({email: req.body.email.trim(), password:req.body.password.trim()});
    return db.User.findOne({where: {email: req.body.email.trim(), password:req.body.password.trim()}})
        .then((result) => {
            if(result != null){
                req.session.loggedin = true;
                req.session.account = req.body.email;
                res.send(true);
            }
            else{
                console.log(result);
                res.send(false);
            }
        })
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.status(400).send(err);
        });
    /* if(!(userHendler.selector(req.body.email, req.body.pass)))
       return res.send(false);
     else {
       req.session.loggedin = true;
       req.session.account = req.body.email;
       return res.send(true);
     }*/
};

exports.siteAccess = function (req, res, next) {
    if (!(req.session.loggedin))
        res.render('logIn');
    else
        res.render('userPage');
};


class validations{
    /**
     * cheks the 2 inputs are the same
     */
    static notEmpty=function (value) {
        console.log("notEmpty");
        return value.trim().length > 0;
    }

    /**
     * sets the security requirements of passsword
     */
    static passwordRules = function (pass) {
        console.log("passwordRules");
        return pass.length >= 8;
    }
}
