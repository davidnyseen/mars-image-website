const userHendler = require('../myModels/user-model.js');
var express = require('express');
const { redirect } = require('express/lib/response');
const Cookies = require("cookies");
const {json} = require("express");
var router = express.Router();
const db = require('../models');
const mainController = require("../controllers/mainController.js");


router.get('/', mainController.mainRouter );
router.get('/register', mainController.reRoutLogged );
router.get('/register', mainController.register );
router.get('/logIn', mainController.reRoutLogged );
router.get('/logIn', mainController.logIn );
router.get('/register/set-password', mainController.mainRouter );
router.post('/register/set-password', mainController.goToSetPass );
router.post('/register/api/emailavailable', mainController.emailAvailable );
router.post('/register/api/password/confirmation', mainController.confirmNewUser );
router.post('/register/api/accountAccess', mainController.accountAccess );
router.get('/access-mars', mainController.siteAccess );

module.exports = router;
